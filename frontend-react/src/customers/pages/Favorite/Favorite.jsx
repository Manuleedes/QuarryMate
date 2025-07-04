import React, { useEffect } from 'react'
import QuarryCard from '../../components/QuarryCard/QuarryCard'
import { quarries } from '../../../Data/Quarries'
import { useDispatch, useSelector } from 'react-redux'

const Favorite = () => {
  const {auth}=useSelector(store=>store);

  useEffect(()=>{
    // dispatch()
  },[])
  return (
   <div>
    <h1 className='py-5 text-xl font-semibold text-center'>My Favorites</h1>
     <div className='flex flex-wrap justify-center'>
      {auth.favorites?.map((item)=><QuarryCard data={item}/>)}
    </div>
   </div>
  )
}

export default Favorite