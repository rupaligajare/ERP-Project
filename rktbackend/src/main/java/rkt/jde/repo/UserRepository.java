package rkt.jde.repo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import rkt.jde.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByName(String name);
    
    Optional<User> findByEmail(String email);
    boolean existsByName(String name);

	List<User> findByCompany(String company);
}

