package com.Lidigu.service;

import java.util.List;

import com.Lidigu.Exception.UserException;
import com.Lidigu.model.User;

public interface UserService {

	 User findUserProfileByJwt(String jwt) throws UserException;
	
	 User findUserByEmail(String email) throws UserException;

	 List<User> findAllUsers();

	 List<User> getPendingQuarryOwner();

	void updatePassword(User user, String newPassword);

	void sendPasswordResetEmail(User user);

}
