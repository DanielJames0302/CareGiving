import React, { useCallback, useEffect, useState } from 'react'
import './user-activity.css'
import UserActivityDashboard from '../../components/user-activity/user-activity-dashboard'
import { doc, getDoc } from "firebase/firestore";
import { db } from '../../firebase/firebase';
import Spinner from 'react-bootstrap/Spinner';
import { Timestamp } from 'firebase/firestore'
import { auth } from '../../firebase/firebase';
import { onAuthStateChanged } from 'firebase/auth';

const UserActivity = () => {
 
  const [isLoading, setIsLoading] = useState(true)
  const [currentActivities, setCurrentActivities] = useState([])
  const [pastActivities, setPastActivities] = useState([])

  const fetchActivites = useCallback(() => {
    onAuthStateChanged(auth, async (user) => {
      if(user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
    
            docSnap.data()?.currentActivities.forEach(async (item) => {
              const docRef2 = doc(db, "activities", item);
              const docSnap2 = await getDoc(docRef2);
      
              if (docSnap2.exists()) {
                if (docSnap2.data().endDate < Timestamp.fromDate(new Date())) {
                  setPastActivities(data => [...data, {...docSnap2.data(), id: item}])
                } else {
                  setCurrentActivities(data => [...data, {...docSnap2.data(), id: item}])
                }
              }
            })

            setIsLoading(false)
          } else {
            setIsLoading(false)
          } 
      }
      })
      
  }, [])

  useEffect(() => {
    fetchActivites()
  
  }, [fetchActivites]) 
  if (isLoading) {
    return (
      <Spinner className='m-3' animation="border" role="status">
      <span className="visually-hidden">Loading...</span>
     </Spinner>
    )
  }
  return (
    <div className='user-activity-page'>
        <div className="user-activity-page-wrapper">
            <UserActivityDashboard currentActivities={currentActivities} pastActivities={pastActivities}/>
        </div>
    </div>
  )
}

export default UserActivity
