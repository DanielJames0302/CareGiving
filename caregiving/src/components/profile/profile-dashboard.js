import React, { useState, useCallback, useEffect } from "react";
import { Button } from "react-bootstrap";
import { db, auth } from "../../firebase/firebase";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import CreatableSelect from "react-select/creatable";
import Spinner from "react-bootstrap/Spinner";
import { doc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { getDoc } from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux";
import { skills } from "../onboarding/skills";
import "./profile-dashboard.css";
import { useNavigate } from "react-router-dom";
import { logout } from "../../redux/auth-slice";

const ProfileDashboard = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: "",
    phone: "",
    gender: "",
    occupation: "",
    education: "",
    driving: false,
    ownVehicle: false,
    residentialStatus: "",
    dateOfBirth: "",
  });
  const dispatch = useDispatch();
  const [validated, setValidated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [userSkills, setUserSkills] = useState();
  const navigate = useNavigate();

  const userId = useSelector((state) => state.user.userId);
  const fetchActivites = useCallback(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserInfo(docSnap.data());
          setIsLoading(false);
        } else {
          setIsLoading(false);
        }
      }
    });
  }, []);

  useEffect(() => {
    fetchActivites();
  }, [fetchActivites]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prevData) => {
      return {
        ...prevData,
        [name]: value,
      };
    });
  };
  const handleChangeSkills = (userSkills) => {
    setUserSkills(userSkills);
  };

  const handleFormSubmit = async (e) => {
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
    } else {
      e.preventDefault();
      if (!isLoading) {
        setIsLoading(true);
        const docRef = doc(db, "users", userId);
        try {
          await updateDoc(docRef, {
            ...userInfo,
            userSkills,
          });
        } catch (error) {
          setError(error);
        }
        setIsLoading(false);
      }
    }
    setValidated(true);
  };
  const handleLogOut = () => {
    signOut(auth)
      .then(() => {
        dispatch(logout());
        navigate("/");
      })
      .catch((error) => {
        // An error happened.
      });
  };
  return (
    <div className="profile-dashboard">
      <div className="profile-dashboard-wrapper">
        <div className="left-section">
          {isEdit === false ? (
            <Button variant="warning" onClick={() => setIsEdit(true)}>
              Edit
            </Button>
          ) : (
            <Button variant="danger" onClick={() => setIsEdit(false)}>
              Stop edit
            </Button>
          )}
          <div className="profile-dashboard-form">
            <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
              <fieldset disabled={!isEdit}>
                <Row className="mb-3">
                  <Form.Group as={Col} controlId="formGridName">
                    <Form.Label>Name (as in NRIC/FIN/Passport)</Form.Label>
                    <Form.Control
                      name="name"
                      value={userInfo?.name}
                      type="text"
                      placeholder="Enter your name"
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group as={Col} controlId="formGridWhatsappPhoneNumber">
                    <Form.Label>Whatsapp phone number</Form.Label>
                    <Form.Control
                      name="phone"
                      value={userInfo?.phone}
                      type="text"
                      placeholder="Whatsapp phone number"
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Row>
                <Row className="mb-3">
                  <Form.Group as={Col} controlId="formGridGender">
                    <Form.Label>Gender</Form.Label>
                    <Form.Select
                      name="gender"
                      value={userInfo?.gender}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Choose...</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </Form.Select>
                  </Form.Group>

                  <Form.Group as={Col} controlId="formGridGender">
                    <Form.Label>Date of Birth</Form.Label>
                    <Form.Control
                      name="dateOfBirth"
                      value={userInfo?.dateOfBirth}
                      type="date"
                      placeholder="Whatsapp phone number"
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Row>

                <Row className="mb-3">
                  <Form.Group as={Col} controlId="formGridOccupation">
                    <Form.Label>Occupation</Form.Label>
                    <Form.Select
                      name="occupation"
                      value={userInfo?.occupation}
                      defaultValue="Choose..."
                      onChange={handleChange}
                      required
                    >
                      <option value="">Choose...</option>
                      <option value="Student">Student</option>
                      <option value="Employee">Employee</option>
                    </Form.Select>
                  </Form.Group>

                  {userInfo?.occupation === "Student" ? (
                    <Form.Group
                      className="mb-3"
                      controlId="formGridEducationLevel"
                    >
                      <Form.Label>Educational Level</Form.Label>
                      <Form.Control
                        required
                        name="education"
                        value={userInfo?.education}
                        type="name"
                        placeholder="Educational Level"
                        onChange={handleChange}
                      />
                    </Form.Group>
                  ) : (
                    ""
                  )}
                </Row>

                <Row className="mb-3">
                  <Form.Group as={Col} controlId="formGridResidentialStatus">
                    <Form.Label>Residential Status</Form.Label>
                    <Form.Select
                      name="residentialStatus"
                      value={userInfo?.residentialStatus}
                      required
                      onChange={handleChange}
                    >
                      <option value="">Choose...</option>
                      <option value="SingaporeanCitizen">
                        Singaporean Citizen
                      </option>
                      <option value="Student Pass">Student Pass</option>
                      <option value="PermanentResident">
                        Permanent Resident
                      </option>
                      <option value="EmploymentPass">Employment Pass</option>
                      <option value="Dependant'sPass">Depdendant's Pass</option>
                      <option value="Dependant'sPass">Depdendant's Pass</option>
                      <option value="WorkPermit">Work Permit</option>
                      <option value="Visitor">Visitor</option>
                    </Form.Select>
                  </Form.Group>
                  <CreatableSelect
                    className="my-3"
                    name="skills"
                    options={skills}
                    value={userSkills}
                    isMulti={true}
                    onChange={handleChangeSkills}
                  />
                </Row>
                <Row className="mb-3">
                  <Form.Group as={Col} controlId="formGridDriving">
                    <Form.Label>Driving</Form.Label>
                    <Form.Select
                      required
                      name="driving"
                      value={userInfo?.driving}
                      onChange={handleChange}
                    >
                      <option value="">Choose...</option>
                      <option value={true}>Yes</option>
                      <option value={false}>No</option>
                    </Form.Select>
                  </Form.Group>

                  <Form.Group as={Col} controlId="formGridVehicle">
                    <Form.Label>Own vehicle</Form.Label>
                    <Form.Select
                      name="ownVehicle"
                      value={userInfo?.ownVehicle}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Choose...</option>
                      <option value={true}>Yes</option>
                      <option value={false}>No</option>
                    </Form.Select>
                  </Form.Group>
                </Row>

                <Row className="mb-3">
                  <Button className="my-3" variant="primary" type="submit">
                    Submit
                  </Button>
                  {isLoading ? (
                    <Spinner
                      animation="border"
                      className="m-auto"
                      role="status"
                    >
                      <span className="visually-hidden">Loading...</span>
                    </Spinner>
                  ) : null}
                </Row>

                <p className="error-message">{error}</p>
              </fieldset>
            </Form>
          </div>
        </div>
        <div className="right-section">
          <Button variant="warning" onClick={() => handleLogOut()}>
            Log out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileDashboard;
