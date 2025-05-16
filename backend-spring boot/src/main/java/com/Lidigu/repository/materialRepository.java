package com.Lidigu.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.Lidigu.model.Material;

public interface materialRepository extends JpaRepository<Material, Long> {

	
	List<Material> findByQuarryId(Long quarryId);
	
	@Query("SELECT f FROM Material f WHERE "
			+ "f.name LIKE %:keyword% OR "
			+ "f.materialCategory.name LIKE %:keyword% AND "
			+ "f.quarry!=null"
	)
	List<Material> searchByNameOrCategory(@Param("keyword") String keyword);


	

}
