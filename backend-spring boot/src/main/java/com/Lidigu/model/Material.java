package com.Lidigu.model;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

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
    private Long price;
    
    @ManyToOne
    private Category materialCategory;


    @ElementCollection
    @Column(length = 1000)
    private List<String> images;

    private boolean available;

//    @JsonIgnore
    @ManyToOne
    private Quarry quarry;

    @Temporal(TemporalType.TIMESTAMP)
    private Date creationDate;


    
}
