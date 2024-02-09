import React from "react";
import { useCallback, useEffect, useState } from "react";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db, storage } from "../../firebase/firebase.js";
import Spinner from "react-bootstrap/Spinner";
import "./activitypost.css";
import Card from "react-bootstrap/Card";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Timestamp } from "firebase/firestore";
import { Button } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import ModalMessage from "../modal-message/modal-message.js";
import { ref } from "firebase/storage";
import { listAll, getDownloadURL } from "firebase/storage";

const ActivityPost = () => {
  const current_timestamp = Timestamp.fromDate(new Date());
  const [isSuccess, setIsSuccess] = useState(false);
  const [show, setShow] = useState(false);
  const { activityId } = useParams();
  const [feedback, setFeedback] = useState("");
  const user = useSelector((state) => state.user);
  const [activity, setActivity] = useState({});
  const [imgUrl, setImgUrl] = useState("");
  const getActivityDetails = useCallback(async () => {
    const docRef = doc(db, "activities", activityId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setActivity(docSnap.data());
      const listRef = ref(storage, docSnap.data().imageUrl);
      listAll(listRef)
        .then((res) => {
          res.items.forEach((itemRef) => {
            getDownloadURL(itemRef).then((url) => {
              setImgUrl(url);
            });
          });
        })
        .catch((error) => {});
    } else {
      setActivity({});
    }
  }, [activityId]);

  useEffect(() => {
    getActivityDetails();
  }, [getActivityDetails]);
  if (Object.keys(activity).length === 0) {
    return (
      <Spinner className="m-3" animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    );
  }
  const handleVolunteerButton = async () => {
    const docRef = doc(db, "activities", activityId);
    try {
      await updateDoc(docRef, {
        participants: arrayUnion(user.userId),
      });
      setActivity((prevData) => {
        return {
          ...prevData,
          participants: [...prevData?.participants, user.userId],
        };
      });
    } catch (error) {}

    const docRef2 = doc(db, "users", user.userId);
    try {
      await updateDoc(docRef2, {
        currentActivities: arrayUnion(activityId),
      });
    } catch (error) {}
  };
  const handleAddFeedback = async () => {
    setIsSuccess(false);
    if (feedback === "") {
      setShow(false);
      return;
    }
    const docRef2 = doc(db, "activities", activityId);
    try {
      await updateDoc(docRef2, {
        feedback: arrayUnion(feedback),
      });
    } catch (error) {}
    setIsSuccess(true);
    setShow(false);
  };
  return (
    <div className="activity-post">
      <div className="activity-post-wrapper">
        <h2 className="activity-title">{activity?.name}</h2>
        <div className="activity-post-content">
          <div className="activity-post-content-left">
            <div className="activity-image-container">
              <img
                className="activity-image"
                src={
                  imgUrl === ""
                    ? process.env.PUBLIC_URL + "/images/default-volunteer.png"
                    : imgUrl
                }
                alt="activity"
              />
            </div>
            <div className="activity-post-info">
              <h3>Goals</h3>
              <div className="causes-list">
                {activity?.supportedCauses.map((cause, id) => (
                  <div key={id} className="cause-item">
                    {cause}
                  </div>
                ))}
              </div>
              <h3 className="my-3">About the activity</h3>
              <p className="acactivity-post-details">{activity?.details}</p>
              <h3 className="my-3">Feedback</h3>
              <div className="feedback-list">
                {activity?.feedback?.map((item, id) => (
                  <div key={id} className="feedback-item">
                    <p className="feedback-info">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <Card style={{ width: "25%", height: "50%" }}>
            <Card.Body>
              <Card.Title>Date and Time</Card.Title>
              <Card.Text>
                <p>
                  Start: {activity?.startDate.toDate().toDateString()}{" "}
                  {activity?.startDate.toDate().toLocaleTimeString()}
                </p>
                <p>
                  End: {activity?.endDate.toDate().toDateString()}{" "}
                  {activity?.endDate.toDate().toLocaleTimeString()}
                </p>
              </Card.Text>
              <div className="button-controls">
                <button
                  disabled={current_timestamp > activity?.endDate}
                  className={
                    current_timestamp > activity?.endDate
                      ? "volunteer-button expired"
                      : "volunteer-button"
                  }
                  onClick={handleVolunteerButton}
                >
                  {current_timestamp < activity?.endDate
                    ? activity?.participants?.includes(user.userId)
                      ? "Joined"
                      : "Volunteer"
                    : "Ended"}
                </button>
                <Button variant="success" onClick={() => setShow(true)}>
                  Add Feedback
                </Button>
              </div>
            </Card.Body>
          </Card>
          <Modal show={show} onHide={() => setShow(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Type in your feedback</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Group as={Col} controlId="formGridName">
                <Form.Control
                  name="name"
                  type="text"
                  placeholder="Enter your feedback"
                  onChange={(e) => setFeedback(e.target.value)}
                  required
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => handleAddFeedback()}>
                Submit
              </Button>
            </Modal.Footer>
          </Modal>
        </div>

        {isSuccess ? (
          <ModalMessage
            message={"Your feedback has been submitted"}
            isSuccess={isSuccess}
            setIsSuccess={setIsSuccess}
          />
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default ActivityPost;
