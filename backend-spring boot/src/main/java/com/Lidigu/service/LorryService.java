package com.Lidigu.service;

import com.Lidigu.domain.LorryStatus;
import com.Lidigu.model.Lorry;
import com.Lidigu.repository.LorryRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
@RequiredArgsConstructor
public class LorryService implements LorryService1{
    @Autowired
    private LorryRepository lorryRepository;

    @Override
    public Lorry addLorry(String plateNumber, double capacityInTonnes,  String lorryName, String description,  List<String> images  ) {
        Lorry lorry = new Lorry();
        lorry.setNumberPlate(plateNumber);
        lorry.setCapacityInTonnes((long) capacityInTonnes);
        lorry.setAvailable(true);
       // lorry.setQuarry(quarry);
        lorry.setStatus(LorryStatus.AVAILABLE);
        lorry.setName(lorryName);
        lorry.setDescription(description);
        lorry.setImages(images);

        return lorryRepository.save(lorry);



    }

    @Override
    public List<Lorry> getAvailableLorries() {
        return lorryRepository.findAvailableLorriesOrderedByCapacityDesc();

    }

    @Override
    public List<Lorry> getLorriesByQuarryId(Long quarryId) {
        return lorryRepository.findByQuarryId(quarryId);
    }

    @Override
    public void deleteLorry(Long lorryId) {
        lorryRepository.deleteById(lorryId);
    }

    @Override
    public List<Lorry> searchLorriesByPlateNumber(String plateNumber) {
        return lorryRepository.findByNumberPlateContainingIgnoreCase(plateNumber);
    }

    @Override
    public Lorry updateAvailability(Long lorryId, boolean available) {
        Lorry lorry = lorryRepository.findById(lorryId)
                .orElseThrow(() -> new RuntimeException("Lorry not found with ID: " + lorryId));
        lorry.setAvailable(available);
        lorry.setStatus(available ? LorryStatus.AVAILABLE : LorryStatus.ASSIGNED);
        return lorryRepository.save(lorry);
    }

    @Transactional
    public void resetLorryAvailability() {
        List<Lorry> lorries = lorryRepository.findAll();
        lorries.forEach(lorry -> {
            lorry.setAvailable(true);
            lorry.setStatus(LorryStatus.AVAILABLE);
            lorry.setAllocatedWeight(0);
            lorry.setAllocationCost(0);
            lorry.setOrder(null);
        });
        lorryRepository.saveAll(lorries);
    }



}
