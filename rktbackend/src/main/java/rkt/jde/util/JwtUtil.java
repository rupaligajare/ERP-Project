package rkt.jde.util;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

import org.springframework.stereotype.Component;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import rkt.jde.entity.User;

@Component
public class JwtUtil {

    private final String SECRET = "mysecretkeymysecretkeymysecretkey12";
    
    private Key getSignKey() {
        return Keys.hmacShaKeyFor(SECRET.getBytes(StandardCharsets.UTF_8));
    }

    public String generateToken(User user) {
    	return Jwts.builder()
    	        .setSubject(user.getName())
    	        .setIssuedAt(new Date())
    	        .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60))
    	        .signWith(getSignKey(), SignatureAlgorithm.HS256)
    	        .compact();
    }

    public String extractUsername(String token) {
        return Jwts.parser().setSigningKey(SECRET)
            .parseClaimsJws(token).getBody().getSubject();
    }

    public boolean validateToken(String token, User user) {
        return extractUsername(token).equals(user.getName());
    
    }
}

