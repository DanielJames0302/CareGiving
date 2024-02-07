import React from 'react'
import './home-feed.css'
import { collection, getDocs } from "firebase/firestore";
import { db } from '../../firebase/firebase.js'
import { useEffect, useState, useCallback } from 'react'
import Card from 'react-bootstrap/Card';
import Spinner from 'react-bootstrap/Spinner';
import { Link } from 'react-router-dom'

const HomeFeed = () => {
  const [activities, setActivities] = useState([])
 
  const getActivities = useCallback(async () => {
    const getActivitiesFromFirebase = []
      const querySnapshot = await getDocs(collection(db, "activities"));

      querySnapshot.forEach((doc) => {
        getActivitiesFromFirebase.push({
          ...doc.data(),
          id: doc.id
        })
      })
    
    setActivities(getActivitiesFromFirebase)
  }, [])

  useEffect(() => {
    getActivities()
    
  }, [getActivities])
  if (activities.length === 0) {
    return (
      <Spinner animation="border" role="status">
      <span className="visually-hidden">Loading...</span>
     </Spinner>
    )
  }
  return (
    <div className='home-feed'>
      <div className="home-feed-wrapper">
      <div className='activity-list'>
        {activities?.map((activity,id) => (
          <Link style={{textDecoration: 'none'}} to={`/volunteer/${activity.id}`}>
            <Card key={id} style={{ width: '25rem' }}>
            <Card.Img variant="top" src={process.env.PUBLIC_URL+"images/default-volunteer.png"} />
            <Card.Body>
              <Card.Title>{activity.name}</Card.Title>
            </Card.Body>
            <Card.Footer>
                <p className="text-muted">Start: {activity?.startDate.toDate().toDateString()} </p>
                <p className="text-muted">End: {activity?.endDate.toDate().toDateString()} </p>
            </Card.Footer>
           </Card>
          </Link>
        
        ))}
      </div>
    
      </div>
      
    </div>
  )
}

export default HomeFeed
