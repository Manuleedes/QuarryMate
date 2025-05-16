package com.Lidigu.service;

import java.util.List;

import com.Lidigu.Exception.UserException;
import com.Lidigu.model.User;

public interface UserService {

	public User findUserProfileByJwt(String jwt) throws UserException;
	
	public User findUserByEmail(String email) throws UserException;

	public List<User> findAllUsers();

	public List<User> getPendingQuarryOwner();

	void updatePassword(User user, String newPassword);

	void sendPasswordResetEmail(User user);

}
