import React from 'react'
import { useParams } from 'react-router-dom'
import Complaint from '../components/Complaint';
function ComplaintDisplay() {
    const {apartment_id}=useParams();
  return (
    <div>
        <Complaint apartment_id={apartment_id}/>
    </div>
  )
}

export default ComplaintDisplay