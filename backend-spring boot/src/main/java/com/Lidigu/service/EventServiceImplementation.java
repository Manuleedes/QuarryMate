package com.Lidigu.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.Lidigu.Exception.QuarryException;
import com.Lidigu.model.Events;
import com.Lidigu.model.Quarry;
import com.Lidigu.repository.EventRepository;

@Service
public class EventServiceImplementation implements EventsService {
	
	@Autowired
	private EventRepository eventRepository;

	@Autowired
	private QuarryService restaurantService;
	
	@Override
	public Events createEvent(Events event,Long restaurantId) throws QuarryException {
		Quarry quarry=restaurantService.findQuarryById(restaurantId);
		
		Events createdEvent=new Events();
		createdEvent.setQuarry(quarry);
		createdEvent.setImage(event.getImage());
		createdEvent.setStartedAt(event.getStartedAt());
		createdEvent.setEndsAt(event.getEndsAt());
		createdEvent.setLocation(event.getLocation());
		createdEvent.setName(event.getName());
		
		return eventRepository.save(createdEvent);
	}

	@Override
	public List<Events> findAllEvent() {
		// TODO Auto-generated method stub
		return eventRepository.findAll();
	}

	@Override
	public List<Events> findQuarriesEvent(Long id) {
		// TODO Auto-generated method stub
		return eventRepository.findEventsByQuarryId(id);
	}

	@Override
	public void deleteEvent(Long id) throws Exception {
		Events event=findById(id);
		eventRepository.delete(event);
		
	}

	@Override
	public Events findById(Long id) throws Exception {
		Optional<Events> opt=eventRepository.findById(id);
		if(opt.isPresent()) {
			return opt.get();
		}
		throw new Exception("event not found with id "+id);
		
	}

}
