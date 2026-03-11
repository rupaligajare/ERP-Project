package rkt.jde.controller;

import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import rkt.jde.entity.Organization;
import rkt.jde.entity.User;
import rkt.jde.repo.ModuleConfigRepository;
import rkt.jde.repo.OrganizationRepository;
import rkt.jde.repo.UserRepository;

@RestController
@RequestMapping("/api/client")
public class ClientController {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private OrganizationRepository orgRepository;
    @Autowired
    private ModuleConfigRepository moduleRepo;

    @GetMapping("/details")
    public ResponseEntity<?> getMyOrgDetails(Principal principal) {
        // Find the user by their logged-in email
        User user = userRepository.findByName(principal.getName()).get();
        String company = user.getCompany();

        // Get the Org details
        Organization org = orgRepository.findByOrgName(company);
        
        // Get the enabled modules
        List<String> modules = moduleRepo.findByOrgId(org.getId())
                .stream().map(m -> m.getModuleName()).toList();

        // Get only users belonging to this company
        List<User> team = userRepository.findByCompany(company);

        Map<String, Object> response = new HashMap<>();
        response.put("organization", org);
        response.put("modules", modules);
        response.put("users", team);

        return ResponseEntity.ok(response);
    }
}