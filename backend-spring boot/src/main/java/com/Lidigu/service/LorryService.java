package com.Lidigu.service;

import com.Lidigu.domain.LorryStatus;
import com.Lidigu.model.Lorry;
import com.Lidigu.model.Quarry;
import com.Lidigu.repository.LorryRepository;
import com.Lidigu.repository.QuarryRepository;
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

    private QuarryService quarryService;
    @Autowired
    private QuarryRepository quarryRepository;

    @Override
    public Lorry addLorry(String plateNumber, Long quarryId, String lorryName, String description, List<String> images) {
        // Fetch the quarry to attach to this lorry
        Quarry quarry = quarryRepository.findById(quarryId)
                .orElseThrow(() -> new RuntimeException("Quarry with id " + quarryId + " not found"));

        Lorry lorry = new Lorry();
        lorry.setNumberPlate(plateNumber);
        lorry.setAvailable(true);
        lorry.setStatus(LorryStatus.AVAILABLE);
        lorry.setName(lorryName);
        lorry.setDescription(description);
        lorry.setImages(images);
        lorry.setQuarry(quarry); // ✅ set quarry for tracking

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
