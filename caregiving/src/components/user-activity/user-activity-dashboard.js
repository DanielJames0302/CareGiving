import React, { useState } from 'react'
import './user-activity-dashboard.css'
import { Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { db } from '../../firebase/firebase'
import { collection, addDoc } from "firebase/firestore"; 
import ModalMessage from '../modal-message/modal-message'

const UserActivityDashboard = ({currentActivities, pastActivities}) => {
  const user = useSelector((state) => state.user)
  const [option, setOption] = useState(0)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleCertificateRequest = async (item) => {
    setIsSuccess(false)
    await addDoc(collection(db, "requests"), {
      name: user.name,
      activity: item.name,
      hours: 12
    });
    setIsSuccess(true)
  }
  return (
    <div className='user-activity-dashboard'>
      <div className='menu-options'>
        <div className='menu-list'>
          <button className={option===0 ? 'option-btn chosen' : 'option-btn'} onClick={() => setOption(0)}> Current Activities</button>
          <button className={option===1 ? 'option-btn chosen' : 'option-btn'} onClick={() => setOption(1)}> Past Activities</button>
        </div>
      </div>
      <div className='user-activity-dashboard-content'>
        {
          option === 0 ? currentActivities.map((item, id) => (
            <div key={id} className='activity-item'>
              <div className='mr-5'>
                <p className='activity-name'> {item.name}</p>
              </div>
             
  
              <Link to={`/volunteer/${item.id}`} style={{textDecoration: 'none'}} ><Button variant='warning'><strong>Details</strong></Button></Link>
            </div>
  
          )) : pastActivities.map((item, id) => (
            <div key={id} className='activity-item'>
              <div className='mr-5'>
                <p className='activity-name'> {item.name}</p>
              </div>
              <Link to={`/volunteer/${item.id}`} style={{textDecoration: 'none'}}><Button variant='warning'><strong>Details</strong></Button></Link>
              <Button className='mx-3' variant='success' onClick={() => handleCertificateRequest(item)}><strong>Certificate</strong></Button>

            </div>
  
          ))
        }
        
      </div>
      {isSuccess ? <ModalMessage message={'Your request has been sent successfully'} isSuccess={isSuccess} setIsSuccess={setIsSuccess} />:''}
    </div>
  )
}

export default UserActivityDashboard
