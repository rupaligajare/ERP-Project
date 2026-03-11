package rkt.jde.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;

import rkt.jde.entity.ModuleConfig;

public interface ModuleConfigRepository extends JpaRepository<ModuleConfig, Long> {

    @Modifying // Required for delete operations
    @Transactional // Required to execute the change
    void deleteByOrgId(Long orgId);

    List<ModuleConfig> findByOrgId(Long orgId);
}