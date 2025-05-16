package com.Lidigu.service;

import java.util.List;

import com.Lidigu.Exception.QuarryException;
import com.Lidigu.dto.QuarryDto;
import com.Lidigu.model.Quarry;
import com.Lidigu.model.User;
import com.Lidigu.request.CreateQuarryRequest;

public interface QuarryService {

	public Quarry createQuarry(CreateQuarryRequest req, User user);

	public Quarry updateQuarry(Long quarryId, CreateQuarryRequest updatedQuarry)
			throws QuarryException;

	public void deleteQuarry(Long quarryId) throws QuarryException;

	public List<Quarry> getAllQuarry();

	public List<Quarry> searchQuarry(String keyword);
	
	public Quarry findQuarryById(Long id) throws QuarryException;

	public Quarry getQuarriesByUserId(Long userId) throws QuarryException;
	
	public QuarryDto addToFavorites(Long quarryId, User user) throws QuarryException;

	public Quarry updateQuarryStatus(Long id)throws QuarryException;
}
