import React from 'react'
import { useCallback, useEffect, useState} from 'react'
import { doc, getDoc, updateDoc, arrayUnion, } from "firebase/firestore";
import { db } from '../../firebase/firebase.js'
import Spinner from 'react-bootstrap/Spinner';
import './activitypost.css'
import Card from 'react-bootstrap/Card';
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom';

const ActivityPost = () => {
  const { activityId } = useParams()
  const user = useSelector((state) => state.user)
  const [activity, setActivity] = useState({})
  const getActivityDetails = useCallback(async () => {
    const docRef = doc(db, "activities", activityId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      setActivity(docSnap.data())
  
    } else {
      setActivity({})
    }
  }, [activityId])
 
  useEffect(() => {
    getActivityDetails()
  }, [getActivityDetails])
  if (Object.keys(activity).length === 0) {
    return (
        <Spinner className='m-3' animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      
    )
  }
  const handleVolunteerButton = async () => {
    if (activity?.participants?.includes(user.userId)) {
      return;
    }
    const docRef = doc(db, "activities", activityId);
    try {
      await updateDoc(docRef, {
        participants: arrayUnion(user.userId)
      });
      setActivity(prevData => {
        return (
          {
            ...prevData,
            participants: [...prevData.participants, user.userId]
          }
        )
    
      })
    } catch(error) {

    }
    

  }

  return (
    <div className='activity-post'>
      <div className="activity-post-wrapper">
        <h2 className='activity-title'>{activity.name}</h2>
        <div className='activity-post-content'>
          <div className='activity-post-content-left'>
            <div className='activity-image-container'>
            <img className='activity-image' src={process.env.PUBLIC_URL + '/images/default-volunteer.png'} alt='activity' />
            </div>
            <div className='activity-post-info'>
               <h3>Goals</h3>
               <div className="causes-list">
                  {activity.supportedCauses.map((cause, id) => (
                    <div key={id} className="cause-item">
                      {cause}
                    </div>
                  ))}
               </div>
               <h3 className='my-3'>About the acitity</h3>
               <p className='acactivity-post-details'>
                  {activity.details}
               </p>
            </div>
          </div>
          <Card style={{ width: '25%', height: '50%' }}>
          <Card.Body>
            <Card.Title>Date and Time</Card.Title>
            <Card.Text>
                <p>Start: {activity?.startDate.toDate().toDateString()} {activity?.startDate.toDate().toLocaleTimeString()}</p>
                <p>End: {activity?.endDate.toDate().toDateString()} {activity?.endDate.toDate().toLocaleTimeString()}</p>
            </Card.Text>
            <button className='volunteer-button' onClick={handleVolunteerButton}>{activity?.participants?.includes(user.userId) ? 'Joined' : 'Volunteer' }</button>
          </Card.Body>
        </Card>
        </div>
       
       
      </div>
      
    </div>
  )
}

export default ActivityPost
