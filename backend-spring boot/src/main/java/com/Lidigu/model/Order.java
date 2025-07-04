package com.Lidigu.model;


import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
@Table(name = "orders")
public class Order {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne
	private User customer;

	@JsonIgnore
	@ManyToOne
	private Quarry quarry;

	private double totalWeight;

	private Long totalAmount;
	
	private String orderStatus;

	@Temporal(TemporalType.TIMESTAMP)
	private Date createdAt;

	@ManyToOne
	private Address deliveryAddress;

//	@JsonIgnore
	@OneToMany
	private List<OrderItem> items;

	@OneToOne
	private Payment payment;
	
	private int totalItem;
	
	private int totalPrice;

	@OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
	private List<Lorry> allocatedLorries = new ArrayList<>();


	public void setLorryCost(long totalLorryCost) {
	}
}
