package rkt.jde.repo;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import rkt.jde.entity.ErpEnvironment;

public interface EnvRepository extends JpaRepository<ErpEnvironment, Long> {
	
    Optional<ErpEnvironment> findByEnvName(String envName); //
}
