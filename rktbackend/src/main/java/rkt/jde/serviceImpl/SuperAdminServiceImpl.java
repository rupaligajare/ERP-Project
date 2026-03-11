package rkt.jde.serviceImpl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import rkt.jde.entity.ModuleConfig;
import rkt.jde.entity.Organization;
import rkt.jde.entity.User;
import rkt.jde.repo.ModuleConfigRepository;
import rkt.jde.repo.OrganizationRepository;
import rkt.jde.repo.UserRepository;
import rkt.jde.service.SuperAdminService;

@Service
public class SuperAdminServiceImpl implements SuperAdminService {

    private final OrganizationRepository organizationRepository;
    private final UserRepository userRepository;
 
    private final ModuleConfigRepository moduleConfigRepository;
    
    private final PasswordEncoder passwordEncoder;

    // 1. Updated Constructor (Only 3 repositories)
    public SuperAdminServiceImpl(
            OrganizationRepository organizationRepository, 
            UserRepository userRepository, 
            ModuleConfigRepository moduleConfigRepository,PasswordEncoder passwordEncoder) {
        this.organizationRepository = organizationRepository;
        this.userRepository = userRepository;
        this.moduleConfigRepository = moduleConfigRepository;
		this.passwordEncoder = passwordEncoder;
    }

    
    @Override
    public List<Organization> getAllOrganizations() {
        return organizationRepository.findAll();
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    @Transactional
    public void onboardClient(String orgName, String aisUrl, String adminName, String adminEmail) {
        Organization org = new Organization();
        org.setOrgName(orgName);
        org.setJdeAisUrl(aisUrl);
        org.setJdeEnv("DV920");
        org.setStatus("ACTIVE");
        organizationRepository.save(org);

        User admin = new User();
        admin.setName(adminEmail); 
        admin.setFullName(adminName);
        admin.setEmail(adminEmail);
        admin.setCompany(orgName);
        admin.setPassword(passwordEncoder.encode("Welcome123")); 
        admin.setRoles(List.of("ROLE_ORG_ADMIN")); 
        
        userRepository.save(admin);
    }

    @Override
    @Transactional
    public void deleteOrganization(Long id) {
        // Good practice: delete module configs when deleting the org
        moduleConfigRepository.deleteByOrgId(id);
        organizationRepository.deleteById(id);
    }
    
    @Override
    @Transactional
    public void updateOrgModules(Long orgId, List<String> enabledModules) {
        moduleConfigRepository.deleteByOrgId(orgId);

        List<ModuleConfig> configs = enabledModules.stream().map(name -> {
            ModuleConfig config = new ModuleConfig();
            config.setOrgId(orgId);
            config.setModuleName(name);
            config.setEnabled(true);
            return config;
        }).collect(Collectors.toList());

        moduleConfigRepository.saveAll(configs);
    }

    @Override
    public List<String> getEnabledModules(Long orgId) {
        return moduleConfigRepository.findByOrgId(orgId)
                .stream()
                .map(ModuleConfig::getModuleName)
                .collect(Collectors.toList());
    }
}