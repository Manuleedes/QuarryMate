package com.Lidigu.service;

import java.util.List;

import com.Lidigu.Exception.QuarryException;
import com.Lidigu.model.Events;

public interface EventsService {
	
	 Events createEvent(Events event,Long quarryId) throws QuarryException;
	
	 	List<Events> findAllEvent();
	
	 List<Events> findQuarriesEvent(Long id);
	
	 void deleteEvent(Long id) throws Exception;
	
	 Events findById(Long id) throws Exception;

}
