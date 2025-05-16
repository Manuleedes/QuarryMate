package com.Lidigu.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.Lidigu.model.Address;

public interface AddressRepository extends JpaRepository<Address, Long> {

}
