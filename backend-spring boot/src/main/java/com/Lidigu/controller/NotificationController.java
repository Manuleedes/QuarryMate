package com.Lidigu.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.Lidigu.Exception.UserException;
import com.Lidigu.model.Notification;
import com.Lidigu.model.User;
import com.Lidigu.service.NotificationService;
import com.Lidigu.service.UserService;

@RestController
@RequestMapping("/api")
public class NotificationController {
	
	@Autowired
	private NotificationService notificationSerivce;
	@Autowired
	private UserService userService;
	
	@GetMapping("/notifications")
	public ResponseEntity<List<Notification>> findUsersNotification(
			@RequestHeader("Authorization") String jwt) throws UserException{
		User user=userService.findUserProfileByJwt(jwt);
		
		List<Notification> notifications=notificationSerivce.findUsersNotification(user.getId());
		return new ResponseEntity<List<Notification>>(notifications,HttpStatus.ACCEPTED);
	}

}
