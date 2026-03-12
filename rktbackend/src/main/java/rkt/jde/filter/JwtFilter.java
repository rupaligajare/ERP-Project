package rkt.jde.filter;

import java.io.IOException;
import java.util.stream.Collectors;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import rkt.jde.entity.User;
import rkt.jde.service.UserService;
import rkt.jde.util.JwtUtil;

@Component
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserService userService;

    public JwtFilter(JwtUtil jwtUtil, UserService userService) {
        this.jwtUtil = jwtUtil;
        this.userService = userService;
    }
    
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        String path = request.getServletPath();
        // Use startsWith and ensure it handles the slash correctly
        return path.startsWith("/api/auth/") || path.startsWith("/api/jde/connect");
    }


    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain)
                                    throws ServletException, IOException {

      
        String path = request.getServletPath();
        
        // ALLOW BOTH AUTH AND JDE CONNECT WITHOUT A JWT TOKEN
        if (path.startsWith("/api/auth") || path.startsWith("/api/jde/connect")) {
            chain.doFilter(request, response);
            return;
        }

        String header = request.getHeader("Authorization");

        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);
            String username = jwtUtil.extractUsername(token);

            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                User user = userService.loadUserByUsername(username);

                if (jwtUtil.validateToken(token, user)) {
                    // DEBUG LINES
                    System.out.println("Processing Request for: " + username);
                    System.out.println("Roles extracted from User Entity: " + user.getRoles());

                    UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(
                            user,
                            null,
                            user.getRoles().stream()
                                .map(SimpleGrantedAuthority::new)
                                .collect(Collectors.toList())
                        );

                    SecurityContextHolder.getContext().setAuthentication(authToken);
                    System.out.println("SecurityContext updated with authorities: " + 
                                        SecurityContextHolder.getContext().getAuthentication().getAuthorities());
                }
            }
        }

        chain.doFilter(request, response);
    }
}
