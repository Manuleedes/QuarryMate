package com.Lidigu.service;

import java.util.List;

import com.Lidigu.Exception.MaterialException;
import com.Lidigu.Exception.QuarryException;
import com.Lidigu.model.Category;
import com.Lidigu.model.Material;
import com.Lidigu.model.Quarry;
import com.Lidigu.request.CreateMaterialRequest;

public interface MaterialService {

	 Material createMaterial(CreateMaterialRequest req, Category category,
								   Quarry quarry) throws MaterialException, QuarryException;

	void deleteMaterial(Long materialId) throws MaterialException;
	
	 List<Material> getQuarryMaterial(Long quarryId,
										 String materialCategory) throws MaterialException;
	
	 List<Material> searchMaterial(String keyword);
	
	 Material findMaterialById(Long materialId) throws MaterialException;

	 Material updateAvailabilityStatus(Long materialId) throws MaterialException;
}
