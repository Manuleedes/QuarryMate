package com.Lidigu.service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import com.Lidigu.Exception.QuarryException;
import com.Lidigu.domain.PricingUnit;
import com.Lidigu.repository.QuarryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.Lidigu.Exception.MaterialException;
import com.Lidigu.model.Category;
import com.Lidigu.model.Material;
import com.Lidigu.model.Quarry;
import com.Lidigu.repository.materialRepository;
import com.Lidigu.request.CreateMaterialRequest;


@Service
public class MaterialServiceImplementation implements MaterialService {
	@Autowired
	private materialRepository materialRepository;
	@Autowired
	private QuarryRepository quarryRepository;


	public Material createMaterial(CreateMaterialRequest req,
								   Category category,
								   Quarry quarry)
			throws MaterialException, QuarryException {

		try {
			Material material = new Material();
			material.setMaterialCategory(category);
			material.setCreationDate(new Date());
			material.setDescription(req.getDescription());
			material.setImages(req.getImages());
			material.setName(req.getName());
			Double quantity = req.getQuantity() != null ? req.getQuantity() : 0.0;
			material.setQuantity(quantity);
			material.setPricePerUnit(req.getPrice());
			material.setQuarry(quarry);
			material.setPricingUnit(req.getPricingUnit() != null ? req.getPricingUnit() : PricingUnit.TONNE);
			material.setAvailable(quantity > 0);

			material = materialRepository.save(material);

			if (quarry.getMaterials() == null) {
				quarry.setMaterials(new ArrayList<>());
			}
			quarry.getMaterials().add(material);

			return material;
		} catch (Exception e) {
			throw new MaterialException("Failed to create material: " + e.getMessage());
		}
	}
	@Override
	public Material reduceQuantityAfterPayment(Long materialId, Double quantityOrdered) throws MaterialException {
		Material material = findMaterialById(materialId);

		if (quantityOrdered > material.getQuantity()) {
			throw new MaterialException("Ordered quantity exceeds available stock for material: " + material.getName());
		}

		material.setQuantity(material.getQuantity() - quantityOrdered);

		if (material.getQuantity() <= 0) {
			material.setAvailable(false);
			material.setQuantity(0.0); // Ensure it does not go negative
		}

		materialRepository.save(material);
		return material;
	}




	@Override
	public void deleteMaterial(Long materialId) throws MaterialException {
		Material m1= findMaterialById(materialId);
		m1.setQuarry(null);;
		materialRepository.delete(m1);

	}


	@Override
	public List<Material> getQuarryMaterial(
			Long quarryId,
			String materialCategory) throws MaterialException {
		List<Material> materials = materialRepository.findByQuarryId(quarryId);
		return materials;

	}


	@Override
	public List<Material> searchMaterial(String keyword) {
		List<Material> items=new ArrayList<>();
		
		if(keyword!="") {
			System.out.println("keyword -- "+keyword);
			items=materialRepository.searchByNameOrCategory(keyword);
		}
		
		return items;
	}

	@Override
	public Material updateAvailabilityStatus(Long id) throws MaterialException {
		Material material = findMaterialById(id);

		// If quantity is zero, force it to unavailable
		if (material.getQuantity() <= 0) {
			material.setAvailable(false);
		} else {
			material.setAvailable(!material.isAvailable());
		}

		materialRepository.save(material);
		return material;
	}


	@Override
	public Material findMaterialById(Long materialId) throws MaterialException {
		Optional<Material> material = materialRepository.findById(materialId);
		if (material.isPresent()) {
			return material.get();
		}
		throw new MaterialException("material with id" + materialId + "not found");

	}

}
