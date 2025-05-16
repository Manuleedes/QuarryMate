package com.Lidigu.service;

import com.Lidigu.Exception.CartException;
import com.Lidigu.Exception.CartItemException;
import com.Lidigu.Exception.MaterialException;
import com.Lidigu.Exception.UserException;
import com.Lidigu.model.Cart;
import com.Lidigu.model.CartItem;
import com.Lidigu.request.AddCartItemRequest;

public interface CartSerive {

	public CartItem addItemToCart(AddCartItemRequest req, String jwt) throws UserException, MaterialException, CartException, CartItemException;

	public CartItem updateCartItemQuantity(Long cartItemId,int quantity) throws CartItemException;

	public Cart removeItemFromCart(Long cartItemId, String jwt) throws UserException, CartException, CartItemException;

	public Long calculateCartTotals(Cart cart) throws UserException;
	
	public Cart findCartById(Long id) throws CartException;
	
	public Cart findCartByUserId(Long userId) throws CartException, UserException;
	
	public Cart clearCart(Long userId) throws CartException, UserException;
	

	

}
