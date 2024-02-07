import React from 'react'
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import './onboarding-form.css'
import { useState } from 'react'
import  { skills } from './skills.js'
import CreatableSelect from 'react-select/creatable';
import {  useSelector } from 'react-redux' 
import Spinner from 'react-bootstrap/Spinner';
import { db } from '../../firebase/firebase.js'
import { doc, updateDoc } from "firebase/firestore";
import { useNavigate } from 'react-router-dom'



const OnboardingForm = () => {
  const [users, setUsers] = useState({
    name: '', 
    phone: '', 
    gender: '', 
    occupation: '', 
    education: '', 
    driving: false, 
    ownVehicle: false, 
    residentialStatus: '',
    dateOfBirth: '',
  })

  const [userSkills, setUserSkills] = useState([])
  const [validated, setValidated] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const userId = useSelector((state) => state.user.userId )

 

  const handleChange = (e) => {
    const {name, value} = e.target
    setUsers(prevData => {
      return {
        ...prevData,
        [name]: value
      }
    })
  }
  const handleChangeSkills = (userSkills) => {
    setUserSkills(userSkills)
  }

  const handleFormSubmit = async (e) => {
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault()
      e.stopPropagation()
    } else {
      e.preventDefault()
      if (!isLoading) {
        setIsLoading(true)
        const docRef = doc(db, "users", userId);
        try {
          await updateDoc(docRef, {
            ...users,
            userSkills
          });
        
        } catch(error) {
          setError(error)
        }
        setIsLoading(false)
   
        navigate('/')
      }
     
     
    }
    
    setValidated(true);
  
  }

  return (
    <div className='onboarding-form'>
      <div className="onboarding-form-wrapper">
        <Form  noValidate validated={validated}  onSubmit={handleFormSubmit}>
          <h1 className='onboarding-form-title'>Volunteer onboarding</h1>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="formGridName" >
              <Form.Label>Name (as in NRIC/FIN/Passport)</Form.Label>
              <Form.Control name='name' type="text" placeholder="Enter your name" onChange={handleChange} required/>
            </Form.Group>

            <Form.Group as={Col} controlId="formGridWhatsappPhoneNumber">
              <Form.Label>Whatsapp phone number</Form.Label>
              <Form.Control name='phone' type="text" placeholder="Whatsapp phone number" onChange={handleChange} required />
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="formGridGender">
                <Form.Label>Gender</Form.Label>
                <Form.Select name='gender'  onChange={handleChange} required>
                  <option value=''>Choose...</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </Form.Select>
            </Form.Group>

            <Form.Group as={Col} controlId="formGridGender">
                <Form.Label>Date of Birth</Form.Label>
                <Form.Control name="dateOfBirth" type="date" placeholder="Whatsapp phone number" onChange={handleChange} required />
            </Form.Group>
          
          </Row>
       
          <Row className="mb-3">
            <Form.Group as={Col} controlId="formGridOccupation">
                  <Form.Label>Occupation</Form.Label>
                  <Form.Select name='occupation' defaultValue="Choose..." onChange={handleChange} required>
                    <option value=''>Choose...</option>
                    <option value="Student">Student</option>
                    <option value="Employee">Employee</option>
                  </Form.Select>
              </Form.Group>

              {users.occupation === 'Student' ? 
              <Form.Group className="mb-3" controlId="formGridEducationLevel">
                <Form.Label>Educational Level</Form.Label>
                <Form.Control required name='education' type='name' placeholder="Educational Level" onChange={handleChange}  />
              </Form.Group>: ''}


          </Row>
          
          <Row className="mb-3">
              <Form.Group as={Col} controlId="formGridResidentialStatus">
                  <Form.Label>Residential Status</Form.Label>
                  <Form.Select name='residentialStatus' required onChange={handleChange}>
                    <option value=''>Choose...</option>
                    <option value="SingaporeanCitizen">Singaporean Citizen</option>
                    <option value="Student Pass">Student Pass</option>
                    <option value="PermanentResident">Permanent Resident</option>
                    <option value="EmploymentPass">Employment Pass</option>
                    <option value="Dependant'sPass">Depdendant's Pass</option>
                    <option value="Dependant'sPass">Depdendant's Pass</option>
                    <option value="WorkPermit">Work Permit</option>
                    <option value="Visitor">Visitor</option>


                  </Form.Select>
              </Form.Group>
              <CreatableSelect className='my-3' name='skills' options={skills} value={userSkills} isMulti={true} onChange={handleChangeSkills} />

          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="formGridDriving">
                  <Form.Label>Driving</Form.Label>
                  <Form.Select required name='driving' onChange={handleChange} >
                    <option value=''>Choose...</option>
                    <option value={true}>Yes</option>
                    <option value={false}>No</option>
                  </Form.Select>
              </Form.Group>

              <Form.Group as={Col} controlId="formGridVehicle">
                  <Form.Label>Own vehicle</Form.Label>
                  <Form.Select name='ownVehicle' onChange={handleChange} required>
                    <option value=''>Choose...</option>
                    <option value={true}>Yes</option>
                    <option value={false}>No</option>
                  </Form.Select>
              </Form.Group>


          </Row>

            <Row className="mb-3">
              <Button  className="my-3" variant="primary" type="submit">
                Submit
              </Button>
              {isLoading ?  <Spinner animation="border"  className = 'm-auto' role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner> : null }
            </Row>
       

           
          <p className='error-message'>{error}</p>
      </Form>
      </div>
      
    </div>
  )
}

export default OnboardingForm
