package rkt.jde.service;


import rkt.jde.entity.Organization;
import rkt.jde.entity.User;
import java.util.List;
import java.util.Map;

public interface SuperAdminService {

    List<Organization> getAllOrganizations();

    List<User> getAllUsers();

    void deleteOrganization(Long id);
    
    void onboardClient(String orgName, String aisUrl, String adminName, String adminEmail);

	void updateOrgModules(Long orgId, List<String> enabledModules);

    List<String> getEnabledModules(Long orgId);

}