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
//	@Autowired
	private QuarryRepository quarryRepository;


	public Material createMaterial(CreateMaterialRequest req,
								   Category category,
								   Quarry quarry)
			throws MaterialException,
			QuarryException {

		try {
			Material material = new Material();
			material.setMaterialCategory(category);
			material.setCreationDate(new Date());
			material.setDescription(req.getDescription());
			material.setImages(req.getImages());
			material.setName(req.getName());
			material.setQuantity(req.getQuantity() != null ? req.getQuantity() : 0.0);
			material.setPricePerUnit(req.getPrice());
			material.setQuarry(quarry);
			material.setPricingUnit(req.getPricingUnit() != null ? req.getPricingUnit() : PricingUnit.TONNE);
			material.setAvailable(true); // Set default availability

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
	public void deleteMaterial(Long materialId) throws MaterialException {
		Material food= findMaterialById(materialId);
		food.setQuarry(null);;
//		foodRepository.save(food);
		materialRepository.delete(food);

	}


	@Override
	public List<Material> getQuarryMaterial(
			Long quarryId,
			String materialCategory) throws MaterialException {
		List<Material> materials = materialRepository.findByQuarryId(quarryId);
//    if(materialCategory !=null && !materialCategory.equals("")) {
//	    	materials = filterByMaterialCategory(materials, materialCategory);
//	    }
		return materials;

	}
//		if (materialCategory != null && !materialCategory.trim().isEmpty()) {
//			return materialRepository.findByQuarryIdAndCategory(quarryId, materialCategory.trim());
//		}
//
//		return materialRepository.findByQuarryId(quarryId);
	//}



//	private List<Material> filterByVegetarian(List<Material> foods, boolean isVegetarian) {
//	    return foods.stream()
//	            .filter(food -> food.isVegetarian() == isVegetarian)
//	            .collect(Collectors.toList());
//	}
//	private List<Material> filterByNonveg(List<Material> foods, boolean isNonveg) {
//	    return foods.stream()
//	            .filter(food -> food.isVegetarian() == false)
//	            .collect(Collectors.toList());
//	}
//	private List<Material> filterBySeasonal(List<Material> foods, boolean isSeasonal) {
//	    return foods.stream()
//	            .filter(food -> food.isSeasonal() == isSeasonal)
//	            .collect(Collectors.toList());
//	}
//	private List<Material> filterByFoodCategory(List<Material> foods, String foodCategory) {
//
//		return foods.stream()
//			    .filter(food -> {
//			        if (food.getMaterialCategory() != null) {
//			            return food.getMaterialCategory().getName().equals(foodCategory);
//			        }
//			        return false; // Return true if food category is null
//			    })
//			    .collect(Collectors.toList());
//	}

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
		
		material.setAvailable(!material.isAvailable());
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
