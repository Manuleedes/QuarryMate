package com.Lidigu.service;

import java.util.List;

import com.Lidigu.Exception.QuarryException;
import com.Lidigu.dto.QuarryDto;
import com.Lidigu.model.Quarry;
import com.Lidigu.model.User;
import com.Lidigu.request.CreateQuarryRequest;

public interface QuarryService {

	 Quarry createQuarry(CreateQuarryRequest req, User user);

	 Quarry updateQuarry(Long quarryId, CreateQuarryRequest updatedQuarry)
			throws QuarryException;

	 void deleteQuarry(Long quarryId) throws QuarryException;

	 List<Quarry> getAllQuarry();

	 List<Quarry> searchQuarry(String keyword);
	
	 Quarry findQuarryById(Long id) throws QuarryException;

	 Quarry getQuarriesByUserId(Long userId) throws QuarryException;
	
	 QuarryDto addToFavorites(Long quarryId, User user) throws QuarryException;

	 Quarry updateQuarryStatus(Long id)throws QuarryException;
}
