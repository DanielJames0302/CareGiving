import React from 'react'
import { useCallback, useEffect, useState} from 'react'
import { doc, getDoc } from "firebase/firestore";
import { db } from '../../firebase/firebase.js'
import Spinner from 'react-bootstrap/Spinner';



const ActivityPost = () => {

  const [activity, setActivity] = useState({})
  const getActivityDetails = useCallback(async () => {
    const docRef = doc(db, "activities", "8TmcBVKVTDoomcg2WJCl");
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      setActivity(docSnap.data())
    } else {
      // docSnap.data() will be undefined in this case
      setActivity({})
    }
  }, [])
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
  console.log(process.env.PUBLIC_URL)
  return (
    <div className='activity-post'>
      <div className="activity-post-wrapper">
        <h2 className='activity-title'>{activity.name}</h2>
        <img src={process.env.PUBLIC_URL + 'images/default-volunteer.png'} alt='activity' />
      </div>
      
    </div>
  )
}

export default ActivityPost
