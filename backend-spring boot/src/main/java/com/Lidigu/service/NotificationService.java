package com.Lidigu.service;

import java.util.List;

import com.Lidigu.model.Notification;
import com.Lidigu.model.Order;
import com.Lidigu.model.Quarry;
import com.Lidigu.model.User;

public interface NotificationService {
	
	 Notification sendOrderStatusNotification(Order order);
	 void sendQuarryNotification(Quarry quarry, String message);
	 void sendPromotionalNotification(User user, String message);
	
	 List<Notification> findUsersNotification(Long userId);

}
