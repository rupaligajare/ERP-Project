package rkt.jde.service;

import rkt.jde.entity.User;

public interface UserService {

	  public User loadUserByUsername(String username) ;   
	  public void saveUser(User user) ;
}
