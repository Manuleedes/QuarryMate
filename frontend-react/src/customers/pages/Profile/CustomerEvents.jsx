import React, { useEffect, useState } from 'react'
import { getAllEvents, getQuarriesEvents } from '../../../State/Customers/Quarry/quarry.action';
import { useDispatch, useSelector } from 'react-redux';
import EventCard from '../../../Admin/Events/EventCard';

const CustomerEvents = () => {
  const dispatch=useDispatch()
  const jwt=localStorage.getItem("jwt")
 
  const {quarry,auth}=useSelector(store=>store);

  useEffect(()=>{
    dispatch(getAllEvents({jwt}))
  },[auth.jwt])
  return (
    <div className="mt-5 px-5 flex flex-wrap gap-5">
    {quarry.events.map((item)=> <div>
      <EventCard isCustomer={true} item={item}/>
    </div>)}
   
  </div>
  )
}

export default CustomerEvents