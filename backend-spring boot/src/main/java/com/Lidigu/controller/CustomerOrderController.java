package com.Lidigu.controller;

import com.Lidigu.Exception.QuarryException;
import com.Lidigu.domain.PricingUnit;
import com.Lidigu.model.Material;
import com.Lidigu.repository.materialRepository;
import com.Lidigu.service.OrderService;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/customer/orders")
public class CustomerOrderController {
    @Autowired
    private OrderService orderService;

    @Autowired
    private materialRepository materialRepository;



    @PostMapping("/calculate")
    public ResponseEntity<?> calculateOrderEstimate(@RequestBody Map<String, Object> payload) throws QuarryException {
        Long menuItemId = Long.valueOf(payload.get("menuItemId").toString());
        double requestedQuantity = Double.parseDouble(payload.get("quantity").toString());

        Optional<Material> materialOpt = materialRepository.findById(menuItemId);
        if (materialOpt.isEmpty()) {
            throw new QuarryException("Material not found with ID: " + menuItemId);
        }

        Material material = materialOpt.get();

        // Calculate material cost based on pricing unit
        long materialCost = calculateMaterialCost(material, requestedQuantity);

        // Calculate lorries required and cost based on pricing unit
        TransportCalculation transportCalc = calculateTransportNeeds(material, requestedQuantity);

        long totalPrice = materialCost + transportCalc.getLorryCost();

        Map<String, Object> response = new HashMap<>();
        response.put("materialCost", materialCost);
        response.put("lorryCost", transportCalc.getLorryCost());
        response.put("lorriesRequired", transportCalc.getLorriesRequired());
        response.put("totalPrice", totalPrice);
        response.put("quantity", requestedQuantity);
        response.put("unit", material.getPricingUnit().toString());

        return ResponseEntity.ok(response);
    }

    private long calculateMaterialCost(Material material, double quantity) {
        return (long) (quantity * material.getPricePerUnit());
    }

    private TransportCalculation calculateTransportNeeds(Material material, double quantity) {
        int lorriesRequired;
        if (material.getPricingUnit() == PricingUnit.PIECE) {
            // For blocks and cubrols
            int piecesPerLorry = 1000; // This could be configurable based on material type
            lorriesRequired = (int) Math.ceil(quantity / piecesPerLorry);
        } else {
            // For materials measured in tonnes (murram, ballast)
            double tonnesPerLorry = 18.0;
            lorriesRequired = (int) Math.ceil(quantity / tonnesPerLorry);
        }

        long transportCostPerLorry = 25000; // This could be made configurable
        long totalTransportCost = lorriesRequired * transportCostPerLorry;

        return new TransportCalculation(lorriesRequired, totalTransportCost);
    }

    @Data
    @AllArgsConstructor
    private static  class TransportCalculation {
        private int lorriesRequired;
        private long lorryCost;
    }


}
