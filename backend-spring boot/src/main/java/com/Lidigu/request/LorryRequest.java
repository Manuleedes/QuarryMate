package com.Lidigu.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LorryRequest {
    private String plateNumber;
    private double capacityInTonnes;
    private String lorryName;
    private String description;
    private List<String> images;


}
