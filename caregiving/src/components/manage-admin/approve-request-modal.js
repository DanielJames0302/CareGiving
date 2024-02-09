import React, { useState } from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { storage } from '../../firebase/firebase';
import {  uploadBytes, ref } from 'firebase/storage';
import { v4 } from 'uuid'
import { useSelector } from 'react-redux';
import { doc, updateDoc,arrayUnion } from "firebase/firestore";
import { db } from '../../firebase/firebase';

const ApproveRequestModal = ({name, userId, activity, requestId, isApprove, setIsApprove, handleDeleteRequests }) => {
  const user = useSelector((state) => state.user)
  const [certiUpload, setCertiUpload] = useState(null)

  const handleClose = () => setIsApprove(false);

  const uploadImage = () => {
    if (certiUpload === null) {
      return;
    }
    console.log(userId)
    const imgUrl = `/certificates/${userId}/${activity}-${v4()}`
    const imageRef = ref(storage, imgUrl)
    uploadBytes(imageRef, certiUpload).then(async () => {
      handleDeleteRequests(requestId)
      const washingtonRef = doc(db, "users", user.userId);
      await updateDoc(washingtonRef, {
        certificates: arrayUnion(imgUrl)
    });
    })
    setIsApprove(false)
  }
  return (
    <>
    <Modal show={isApprove} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Upload certificate for volunteer</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group controlId="formFile" className="mb-3">
          <Form.Control type="file" onChange={(e) => setCertiUpload(e.target.files[0])} />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="success" onClick={uploadImage}>
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  </>
  )
}

export default ApproveRequestModal
