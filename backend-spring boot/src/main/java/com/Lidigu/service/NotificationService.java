package com.Lidigu.service;

import java.util.List;

import com.Lidigu.model.Notification;
import com.Lidigu.model.Order;
import com.Lidigu.model.Quarry;
import com.Lidigu.model.User;

public interface NotificationService {
	
	public Notification sendOrderStatusNotification(Order order);
	public void sendQuarryNotification(Quarry quarry, String message);
	public void sendPromotionalNotification(User user, String message);
	
	public List<Notification> findUsersNotification(Long userId);

}
