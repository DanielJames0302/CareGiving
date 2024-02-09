import React, { useCallback, useEffect, useState } from 'react'
import './certificate-requests.css'
import { collection, getDocs } from "firebase/firestore";
import { db } from '../../firebase/firebase';
import { Button } from 'react-bootstrap'
import ApproveRequestModal from './approve-request-modal';
import { doc, deleteDoc } from "firebase/firestore";

const CertificateRequests = () => {
  const [requests, setRequests] = useState()
  const [isApprove, setIsApprove] = useState(false)
  const fetchRequests = useCallback(async () => {
    const getRequestsFromFirebase = []
    const querySnapshot = await getDocs(collection(db, "requests"));
    querySnapshot.forEach((doc) => {
      getRequestsFromFirebase.push({
        ...doc.data(),
        id: doc.id
      })
    });
    setRequests(getRequestsFromFirebase)
  }, [])
  useEffect(() => {
    fetchRequests()
  }, [fetchRequests])

  const handleDeleteRequests = async (requestId) => {
      await deleteDoc(doc(db, "requests", requestId));
      const newRequests = requests.filter((request) => request.id !== requestId)
      setRequests(newRequests)
  }
  return (
    <div className='certificate-request'>
        <div className="requests-list">
            {requests?.map((request, id) => (
              <div key={id} className="request-item">
                <div className='request-info'>
                 <p className='volunteer-name'>{request.name}</p>
                 <p className='activity-name'>{request.activity}</p>
                 <p><strong>Volunteer hours: </strong> {request.hours}</p>
                </div>
                <div className="request-control-btn">
                  <Button variant="success" onClick={() => setIsApprove(true)}>Approve</Button>
                  <Button variant="danger" onClick={() => handleDeleteRequests(request.id)}>Reject</Button>
                </div>
                {true && <ApproveRequestModal isApprove={isApprove} name={request.name} activity={request.activity} requestId={request.id} setIsApprove={setIsApprove} handleDeleteRequests={handleDeleteRequests} />}
             

               
              </div>
            ))}
        </div>
      
    </div>
  )
}

export default CertificateRequests
