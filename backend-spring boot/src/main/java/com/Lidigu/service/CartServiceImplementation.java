package com.Lidigu.service;



import java.util.Optional;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.Lidigu.Exception.CartException;
import com.Lidigu.Exception.CartItemException;
import com.Lidigu.Exception.MaterialException;
import com.Lidigu.Exception.UserException;
import com.Lidigu.model.Cart;
import com.Lidigu.model.CartItem;
import com.Lidigu.model.Material;
import com.Lidigu.model.User;
import com.Lidigu.repository.CartItemRepository;
import com.Lidigu.repository.CartRepository;
import com.Lidigu.repository.materialRepository;
import com.Lidigu.request.AddCartItemRequest;

@Service
public class CartServiceImplementation implements CartSerive {
	@Autowired
	private CartRepository cartRepository;
	@Autowired
	private UserService userService;
	@Autowired
	private CartItemRepository cartItemRepository;
	@Autowired
	private materialRepository menuItemRepository;

	@Override
	public CartItem addItemToCart(AddCartItemRequest req, String jwt) throws UserException, MaterialException, CartException, CartItemException {

		User user = userService.findUserProfileByJwt(jwt);
		Optional<Material> menuItem=menuItemRepository.findById(req.getMenuItemId());
		if(menuItem.isEmpty()) {
			throw new MaterialException("Menu Item not exist with id "+req.getMenuItemId());
		}
		Cart cart = findCartByUserId(user.getId());

		for (CartItem cartItem : cart.getItems()) {
			if (cartItem.getMaterial().equals(menuItem.get())) {

				int newQuantity = cartItem.getQuantity() + req.getQuantity();
				return updateCartItemQuantity(cartItem.getId(),newQuantity);
			}
		}

		CartItem newCartItem = new CartItem();
		newCartItem.setMaterial(menuItem.get());
		newCartItem.setQuantity(req.getQuantity());
		newCartItem.setCart(cart);
		double pricePerTonne = 2000.0;
		double quantity = req.getQuantity();
		long materialCost = (long) (quantity * pricePerTonne);
		int lorriesRequired = (int) Math.ceil(quantity / 18.0);
		long lorryCost = lorriesRequired * 25000;
		long totalPrice = materialCost + lorryCost;
		newCartItem.setTotalPrice(totalPrice);
		CartItem savedItem=cartItemRepository.save(newCartItem);
		cart.getItems().add(savedItem);
		cartRepository.save(cart);
		return savedItem;

	}


	@Override
	public CartItem updateCartItemQuantity(Long cartItemId,int quantity) throws CartItemException {
		Optional<CartItem> cartItem=cartItemRepository.findById(cartItemId);
		if(cartItem.isEmpty()) {
			throw new CartItemException("cart item not exist with id "+cartItemId);
		}
		cartItem.get().setQuantity(quantity);
		cartItem.get().setTotalPrice((cartItem.get().getMaterial().getPricePerUnit()*quantity));
		return cartItemRepository.save(cartItem.get());
	}

	@Override
	public Cart removeItemFromCart(Long cartItemId, String jwt) throws UserException, 
	CartException, CartItemException {

		User user = userService.findUserProfileByJwt(jwt);

		Cart cart = findCartByUserId(user.getId());
		
		Optional<CartItem> cartItem=cartItemRepository.findById(cartItemId);
		
		if(cartItem.isEmpty()) {
			throw new CartItemException("cart item not exist with id "+cartItemId);
		}
		cart.getItems().remove(cartItem.get());
		return cartRepository.save(cart);
	}

	@Override
	public Long calculateCartTotals(Cart cart) throws UserException {
		final double PRICE_PER_TONNE = 2000.0;
		final long LORRY_COST = 25000;

		double totalTonnes = 0.0;
		long totalMaterialCost = 0L;
		for (CartItem cartItem : cart.getItems()) {
			double quantity = cartItem.getQuantity();
			long materialCost = (long) (quantity * PRICE_PER_TONNE);
			cartItem.setTotalCost(materialCost);
			totalMaterialCost += materialCost;
			totalTonnes += quantity;
		}
		int lorriesRequired = (int) Math.ceil(totalTonnes / 18.0);
		long lorryCost = lorriesRequired * LORRY_COST;
		var totalCost = totalMaterialCost + lorryCost;
		return totalCost;
	}

	@Override
	public Cart findCartById(Long id) throws CartException {
		Optional<Cart> cart = cartRepository.findById(id);
		if(cart.isPresent()) {
			return cart.get();
		}
		throw new CartException("Cart not found with the id "+id);
	}
	@Override
	public Cart findCartByUserId(Long userId) throws CartException, UserException {
	
		Optional<Cart> opt=cartRepository.findByCustomer_Id(userId);
		
		if(opt.isPresent()) {
			return opt.get();
		}
		throw new CartException("cart not found");
	}
	@Override
	public Cart clearCart(Long userId) throws CartException, UserException {
		Cart cart=findCartByUserId(userId);
		cart.getItems().clear();
		return cartRepository.save(cart);
	}

	

}
