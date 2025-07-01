package com.Lidigu.service;

import com.Lidigu.model.Lorry;

import java.util.List;

public interface LorryService1 {

     Lorry addLorry(String plateNumber, Long quarryId, String lorryName, String description, List<String> images );
     List<Lorry> getAvailableLorries();
     List<Lorry> getLorriesByQuarryId(Long quarryId);
     void deleteLorry(Long lorryId);
     List<Lorry> searchLorriesByPlateNumber(String plateNumber);
     Lorry updateAvailability(Long lorryId, boolean available);
}
