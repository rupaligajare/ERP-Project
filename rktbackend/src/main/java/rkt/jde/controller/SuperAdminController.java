package rkt.jde.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import rkt.jde.dto.OnboardRequest;
import rkt.jde.entity.Organization;
import rkt.jde.entity.User;
import rkt.jde.repo.OrganizationRepository;
import rkt.jde.repo.UserRepository;
import rkt.jde.service.SuperAdminService;

@RestController
@RequestMapping("/api/superadmin")
@CrossOrigin(origins = "http://localhost:3000")
public class SuperAdminController {

    @Autowired
    private SuperAdminService superAdminService;

    @GetMapping("/organizations")
    public List<Organization> getAllOrganizations() {
        return superAdminService.getAllOrganizations();
    }

    @GetMapping("/users/all")
    public List<User> getGlobalUsers() {
        return superAdminService.getAllUsers();
    }

    @PostMapping("/organizations/onboard")
    public ResponseEntity<?> onboardClient(@RequestBody OnboardRequest request) {
        try {
            superAdminService.onboardClient(
                request.getOrg_name(), 
                request.getJde_ais_url(), 
                request.getAdmin_name(), 
                request.getAdmin_email()
            );
            return ResponseEntity.ok("Client and Admin Onboarded Successfully");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error during onboarding: " + e.getMessage());
        }
    }
    
    @DeleteMapping("/organizations/{id}")
    public ResponseEntity<?> deleteOrg(@PathVariable Long id) {
        try {
            superAdminService.deleteOrganization(id);
            return ResponseEntity.ok("Organization deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error deleting organization");
        }
    }
    
    @PostMapping("/organizations/{id}/modules")
    public ResponseEntity<?> updateModules(@PathVariable Long id, @RequestBody List<String> enabledModules) {
        superAdminService.updateOrgModules(id, enabledModules);
        return ResponseEntity.ok("Modules updated successfully");
    }
}