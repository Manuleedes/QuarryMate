package com.Lidigu.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.Lidigu.Exception.QuarryException;
import com.Lidigu.dto.QuarryDto;
import com.Lidigu.model.Address;
import com.Lidigu.model.Quarry;
import com.Lidigu.model.User;
import com.Lidigu.repository.AddressRepository;
import com.Lidigu.repository.QuarryRepository;
import com.Lidigu.repository.UserRepository;
import com.Lidigu.request.CreateQuarryRequest;

@Service
public class QuarryServiceImplementation implements QuarryService {
	@Autowired
	private QuarryRepository quarryRepository;
	@Autowired
	private AddressRepository addressRepository;
	
	@Autowired
	private UserService userService;
	
	@Autowired
	private UserRepository userRepository;
	

	@Override
	public Quarry createQuarry(CreateQuarryRequest req, User user) {
		Address address=new Address();
		address.setCity(req.getAddress().getCity());
		address.setCountry(req.getAddress().getCountry());
		address.setFullName(req.getAddress().getFullName());
		address.setPostalCode(req.getAddress().getPostalCode());
		address.setState(req.getAddress().getState());
		address.setStreetAddress(req.getAddress().getStreetAddress());
		Address savedAddress = addressRepository.save(address);
		
		Quarry quarry = new Quarry();
		
		quarry.setAddress(savedAddress);
		quarry.setContactInformation(req.getContactInformation());
		quarry.setDescription(req.getDescription());
		quarry.setImages(req.getImages());
		quarry.setName(req.getName());
		quarry.setOpeningHours(req.getOpeningHours());
		quarry.setRegistrationDate(req.getRegistrationDate());
		quarry.setOwner(user);
		Quarry savedQuarry = quarryRepository.save(quarry);

		return savedQuarry;
	}

	@Override
	public Quarry updateQuarry(Long quarryId, CreateQuarryRequest updatedReq)
			throws QuarryException {
		Quarry quarry = findQuarryById(quarryId);
		if (quarry.getDescription() != null) {
			quarry.setDescription(updatedReq.getDescription());
		}
		return quarryRepository.save(quarry);
	}
	
	@Override
	public Quarry findQuarryById(Long quarryId) throws QuarryException {
		Optional<Quarry> quarry = quarryRepository.findById(quarryId);
		if (quarry.isPresent()) {
			return quarry.get();
		} else {
			throw new QuarryException("Quarry with id " + quarryId + "not found");
		}
	}

	@Override
	public void deleteQuarry(Long quarryId) throws QuarryException {
		Quarry quarry = findQuarryById(quarryId);
		if (quarry != null) {
			quarryRepository.delete(quarry);
			return;
		}
		throw new QuarryException("Restaurant with id " + quarryId + " Not found");

	}

	@Override
	public List<Quarry> getAllQuarry() {
		return quarryRepository.findAll();
	}


	@Override
	public Quarry getQuarriesByUserId(Long userId) throws QuarryException {
		Quarry quarries =quarryRepository.findByOwnerId(userId);
		return quarries;
	}



	@Override
	public List<Quarry> searchQuarry(String keyword) {
		return quarryRepository.findBySearchQuery(keyword);
	}

	@Override
	public QuarryDto addToFavorites(Long quarryId, User user) throws QuarryException {
		Quarry quarry= findQuarryById(quarryId);
		
		QuarryDto dto=new QuarryDto();
		dto.setTitle(quarry.getName());
		dto.setImages(quarry.getImages());
		dto.setId(quarry.getId());
		dto.setDescription(quarry.getDescription());

		boolean isFavorited = false;
		List<QuarryDto> favorites = user.getFavorites();
		for (QuarryDto favorite : favorites) {
			if (favorite.getId().equals(quarryId)) {
				isFavorited = true;
				break;
			}
		}

		if (isFavorited) {
			favorites.removeIf(favorite -> favorite.getId().equals(quarryId));
		} else {
			favorites.add(dto);
		}
		
		User updatedUser = userRepository.save(user);
		return dto;
	}

	@Override
	public Quarry updateQuarryStatus(Long id) throws QuarryException {
		Quarry quarry= findQuarryById(id);
		quarry.setOpen(!quarry.isOpen());
		return quarryRepository.save(quarry);
	}

}
