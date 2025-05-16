package com.Lidigu.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.Lidigu.Exception.QuarryException;
import com.Lidigu.model.Events;
import com.Lidigu.response.ApiResponse;
import com.Lidigu.service.EventsService;

@RestController
@RequestMapping("/api")
public class EventController {
	
	@Autowired
	public EventsService eventService;
	
	@PostMapping("/admin/events/quarry/{quarryId}")
	public ResponseEntity<Events> createEvents(@RequestBody Events event,
			@PathVariable Long quarryId) throws QuarryException {
		Events createdEvents=eventService.createEvent(event, quarryId);
		return new ResponseEntity<>(createdEvents,HttpStatus.ACCEPTED);
	}
	
	@GetMapping("/events")
	public ResponseEntity<List<Events>> findAllEvents() throws QuarryException {
		List<Events> events=eventService.findAllEvent();
		return new ResponseEntity<>(events,HttpStatus.ACCEPTED);
	}
	
	@GetMapping("/admin/events/quarry/{quarryId}")
	public ResponseEntity<List<Events>> findQuarriesEvents(
			@PathVariable Long quarryId) throws QuarryException {
		List<Events> events=eventService.findQuarriesEvent(quarryId);
		return new ResponseEntity<>(events,HttpStatus.ACCEPTED);
	}
	
	@DeleteMapping("/admin/events/{id}")
	public ResponseEntity<ApiResponse> deleteEvents(
			@PathVariable Long id) throws Exception{
		eventService.deleteEvent(id);
		ApiResponse res=new ApiResponse("Events Deleted",true);
		return new ResponseEntity<>(res,HttpStatus.ACCEPTED);
	}

}
