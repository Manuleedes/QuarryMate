package com.Lidigu.model;

import com.Lidigu.domain.LorryStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data

public class Lorry {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String numberPlate;

    private double capacityInTonnes;

    private boolean available = true;

    private double allocatedWeight;

    private long allocationCost; // NEW FIELD

    @ManyToOne
    private Order order;

    @Enumerated(EnumType.STRING)
    private LorryStatus status;
}
