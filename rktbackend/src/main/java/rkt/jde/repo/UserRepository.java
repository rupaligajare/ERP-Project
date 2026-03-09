package rkt.jde.repo;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import rkt.jde.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByName(String name);
    
    boolean existsByName(String name);
}

