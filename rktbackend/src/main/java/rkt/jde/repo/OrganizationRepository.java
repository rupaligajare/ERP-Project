package rkt.jde.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import rkt.jde.entity.Organization;

public interface OrganizationRepository extends JpaRepository<Organization, Long> {

	Organization findByOrgName(String company);
   
}