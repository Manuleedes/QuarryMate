package com.Lidigu.request;

import java.time.LocalDateTime;
import java.util.List;

import com.Lidigu.model.Address;
import com.Lidigu.model.ContactInformation;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateQuarryRequest {

	private Long id;
	private String name;
	private String description;
	private Address address;
	private ContactInformation contactInformation;
	private String openingHours;
	private List<String> images;
    private LocalDateTime registrationDate;
}
