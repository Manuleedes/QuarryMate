package com.Lidigu.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
public class OrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Material material;
    
    private Double quantity;
    private Long totalPrice;

    @OneToOne
    private Lorry lorry;

    @ManyToOne
    @JsonBackReference
    private Order order;

}

