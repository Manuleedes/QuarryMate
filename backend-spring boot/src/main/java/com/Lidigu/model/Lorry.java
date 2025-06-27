package com.Lidigu.model;

import com.Lidigu.domain.LorryStatus;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;

import java.util.List;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
@NamedQueries({
        @NamedQuery(
                name = "Lorry.findAvailableLorriesOrderedByCapacityDesc",
                query = "SELECT l FROM Lorry l WHERE l.available = true ORDER BY l.capacityInTonnes DESC"
        )
})
public class Lorry {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String Name;
    @NotBlank
    private String numberPlate;

    private boolean available = true;

    private double allocatedWeight;

    @ManyToOne
    private Quarry quarry;

    private String description;
    @ElementCollection
    @Column(length = 1000)
    private List<String> images;

    private long allocationCost;
    @NotNull
    private long  capacityInTonnes;
    @Enumerated(EnumType.STRING)
    private LorryStatus status = LorryStatus.AVAILABLE;

    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "order_id")
    private Order order;




}
