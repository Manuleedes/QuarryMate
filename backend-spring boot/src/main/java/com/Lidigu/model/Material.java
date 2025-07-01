package com.Lidigu.model;


import java.util.Date;
import java.util.List;

import com.Lidigu.domain.PricingUnit;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Material {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    private String description;
    private Long pricePerUnit;

    @Enumerated(EnumType.STRING)
    private PricingUnit pricingUnit;

    @ManyToOne
    private Category materialCategory;

    @ElementCollection
    @Column(length = 1000)
    private List<String> images;

    private boolean available;
    private Double quantity;

//    @JsonIgnore
    @ManyToOne
    private Quarry quarry;

    @Temporal(TemporalType.TIMESTAMP)
    private Date creationDate;

    public void reduceQuantity(double quantityOrdered) {
        if (this.quantity >= quantityOrdered) {
            this.quantity -= quantityOrdered;
            if (this.quantity <= 0) {
                this.available = false;
                this.quantity = 0.0;
            }
        } else {
            throw new IllegalArgumentException("Insufficient stock for material: " + this.name);
        }
    }
    
}
