package com.Lidigu.request;



import java.util.List;

import com.Lidigu.model.Category;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateMaterialRequest {
	

    
    private String name;
    private String description;
    private Long price;
    
  
    private Category category;
    private List<String> images;

   
    private Long quarryId;
    

    

	

}
