import React, { useState } from 'react'
import './create-activity-form.css'
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import CreatableSelect from 'react-select/creatable';
import { db } from '../../firebase/firebase.js'
import { collection, addDoc } from "firebase/firestore"; 
import { goals } from './goals.js';
import Spinner from 'react-bootstrap/Spinner';
import { v4 } from 'uuid'
import { storage } from '../../firebase/firebase';
import {  uploadBytes, ref } from 'firebase/storage';



const CreateActivityForm = () => {
  const[activity, setActivity] = useState({
    details: '',
    name: '',
  })
  const [activityGoals, setActivityGoals] = useState([])
  const [startDate, setStartDate] = useState(dayjs(new Date().toDateString()));
  const [endDate, setEndDate] = useState(dayjs(new Date().toDateString()));
  const [validated, setValidated] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [imageUpload, setImageUpload] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChangeActivityGoals = (activityGoals) => {
    setActivityGoals(activityGoals)
  }
 
  const handleFormSubmit = async (e) => {
    setIsSuccess(false)
    setError('')
    const form = e.currentTarget;
    if (imageUpload === null) {
      setError('Please choose image for activity')
      return;
    }
    if (form.checkValidity() === false) {
      e.preventDefault()
      e.stopPropagation()
      setValidated(true)
      setError('Please fill in the blank')
    } else {
      e.preventDefault()
      if (!isLoading) {
        setIsLoading(true)
        try {
          const imgUrl = `/activities/${activity.name}-${v4()}`
          await addDoc(collection(db, "activities"), {
            ...activity,
            startDate: startDate.$d,
            endDate: endDate.$d,
            supportedCauses: activityGoals,
            imageUrl: imgUrl
  
          });
          
          const imageRef = ref(storage, imgUrl)
          uploadBytes(imageRef, imageUpload).then(async () => {            
          });
          setImageUpload(null)
          setIsSuccess(true)
          setActivity({
            details: '',
            name: '',
          })
          setActivityGoals([])
        } catch(error) {
          setError(error)
        }
        setIsLoading(false)
      }
      setValidated(false);
    }
 
  }
  const handleChangeInputForm = (e) => {
    const {name, value} = e.target
    setActivity(prevData => {
      return {
        ...prevData,
        [name]: value
      }
    })
  }

  return (
    <div className='create-activity-form'>
       <Form  noValidate validated={validated} onSubmit={handleFormSubmit}>
        <Form.Group as={Col} controlId="formGridActivityName">
          <Form.Label> <strong>Activity Name</strong></Form.Label>
          <Form.Control name='name' type="text" value={activity.name} placeholder="Enter activity name" onChange={handleChangeInputForm} required/>
        </Form.Group>

      <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DateTimePicker', 'DateTimePicker']}>
        <DateTimePicker
          label="Start Date"
          value={startDate}
          onChange={(newValue) => {
            setStartDate(newValue)
          }}
          required
        />
         <DateTimePicker
          label="End Date"
          value={endDate}
          onChange={(newValue) => {
            setEndDate(newValue)
          }}
        />
      </DemoContainer>
       
    </LocalizationProvider>

      <Form.Group className='my-3' as={Col} controlId="formGridActivityInfo">
          <Form.Label> <strong>Activity Information</strong></Form.Label>
          <Form.Control name='details' type="text" value={activity.details} placeholder="Enter activity information" onChange={handleChangeInputForm} required />
      </Form.Group>
      <Form.Group className='my-3' as={Col}>
          <Form.Label> <strong>Goals</strong></Form.Label>
          <CreatableSelect name='goals' options={goals} value={activityGoals} isMulti={true} onChange={handleChangeActivityGoals} required />
      </Form.Group>

      <Form.Group controlId="formFile" className="mb-3">
          <Form.Label><strong>Upload image for activity</strong></Form.Label>
          <Form.Control type="file" onChange={(e) => setImageUpload(e.target.files[0])} />
      </Form.Group>
      

      <div className="form-controls">
              <Button  className="my-3" variant="primary" type="submit">
                Submit
              </Button>
              {isLoading ?  <Spinner animation="border"  className = 'm-auto' role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner> : null }
              <div className='form-message'>
                <p className='text-danger'>{error}</p>
              {isSuccess && <p className='text-success'> <strong>Activity created successfully!</strong></p>}
              </div>
      </div>
   
    </Form>

      
    </div>
  )
}

export default CreateActivityForm
