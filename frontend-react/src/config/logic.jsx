export const isPresentInFavorites=(favorites,quarry)=>{
    for(let item of favorites){
      if(quarry.id===item.id)return true
    }
    return false;
  }