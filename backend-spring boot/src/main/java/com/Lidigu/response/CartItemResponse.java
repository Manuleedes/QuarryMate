package com.Lidigu.response;

import com.Lidigu.model.Material;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class CartItemResponse {
    private Long id;
    private int quantity;
    private long totalPrice;
    private Material material;
}
