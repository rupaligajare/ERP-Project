package rkt.jde.serviceImpl;

import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import rkt.jde.entity.User;
import rkt.jde.repo.UserRepository;
import rkt.jde.service.UserService;

@Service
public class UserServiceImpl implements UserService{
	
	 private final UserRepository userRepository;

	    public UserServiceImpl(UserRepository userRepository) {
	        this.userRepository = userRepository;
	    }

	    public User loadUserByUsername(String username) {
	        return userRepository.findByName(username)
	                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
	    }

	    public void saveUser(User user) {
	        userRepository.save(user);
	    }

}
