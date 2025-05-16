export function isValid(cartItems){
    console.log("cartItems -------------- ",cartItems[0].material?.quarry.id)
    const quarryId=cartItems[0]?.material?.quarry.id
   
    for(let item of cartItems){
        console.log("item ---- ", item.quarry?.id)
      if(item.material?.quarry.id!==quarryId){
        return false;
      }
    }
    return true
  }