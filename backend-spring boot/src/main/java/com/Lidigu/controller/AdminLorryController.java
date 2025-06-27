package com.Lidigu.controller;

import com.Lidigu.model.Lorry;
import com.Lidigu.request.LorryRequest;
import com.Lidigu.service.LorryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/lorries")
public class AdminLorryController {

    @Autowired
    private LorryService lorryService;

    // Create a new lorry
    @PostMapping("/add")
    public ResponseEntity<Lorry> addLorry(@RequestBody LorryRequest request) {
        Lorry lorry = lorryService.addLorry(
                request.getPlateNumber(),
                request.getCapacityInTonnes(),
                request.getLorryName(),
                request.getDescription(),
                request.getImages()
        );
        return ResponseEntity.ok(lorry);
    }

    // Get all available lorries
    @GetMapping("/available")
    public ResponseEntity<List<Lorry>> getAvailableLorries() {
        return ResponseEntity.ok(lorryService.getAvailableLorries());
    }

    // Get lorries by quarry ID
    @GetMapping("/quarry/{quarryId}")
    public ResponseEntity<List<Lorry>> getLorriesByQuarryId(@PathVariable Long quarryId) {
        return ResponseEntity.ok(lorryService.getLorriesByQuarryId(quarryId));
    }

    // Delete a lorry by ID
    @DeleteMapping("/{lorryId}")
    public ResponseEntity<Void> deleteLorry(@PathVariable Long lorryId) {
        lorryService.deleteLorry(lorryId);
        return ResponseEntity.noContent().build();
    }

    // Search lorries by plate number (basic search)
    @GetMapping("/search")
    public ResponseEntity<List<Lorry>> searchLorries(@RequestParam("plate") String plate) {
        return ResponseEntity.ok(lorryService.searchLorriesByPlateNumber(plate));
    }

    // Update lorry availability
    @PatchMapping("/{lorryId}/availability")
    public ResponseEntity<Lorry> updateLorryAvailability(@PathVariable Long lorryId, @RequestParam boolean available) {
        Lorry updatedLorry = lorryService.updateAvailability(lorryId, available);
        return ResponseEntity.ok(updatedLorry);
    }
}
