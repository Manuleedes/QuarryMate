package com.Lidigu.service;

import java.util.List;

import com.Lidigu.Exception.QuarryException;
import com.Lidigu.model.Events;

public interface EventsService {
	
	public Events createEvent(Events event,Long quarryId) throws QuarryException;
	
	public List<Events> findAllEvent();
	
	public List<Events> findQuarriesEvent(Long id);
	
	public void deleteEvent(Long id) throws Exception;
	
	public Events findById(Long id) throws Exception;

}
