import React from "react";
import "./home-feed.css";
import { collection, getDocs } from "firebase/firestore";
import { db, storage } from "../../firebase/firebase.js";
import { useEffect, useState, useCallback } from "react";
import Card from "react-bootstrap/Card";
import Spinner from "react-bootstrap/Spinner";
import { Link } from "react-router-dom";
import { ref } from "firebase/storage";
import { getDownloadURL } from "firebase/storage";
import { listAll } from "firebase/storage";

const HomeFeed = () => {
  const [activities, setActivities] = useState([]);

  const getActivities = useCallback(async () => {
    const querySnapshot = await getDocs(collection(db, "activities"));
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const listRef = ref(storage, data.imageUrl);
      listAll(listRef)
        .then((res) => {
          res.items.forEach((itemRef) => {
            getDownloadURL(itemRef).then((url) => {
              console.log(url);
              setActivities((data) => [
                ...data,
                {
                  ...doc.data(),
                  id: doc.id,
                  file: url,
                },
              ]);
            });
          });
        })
        .catch((error) => {});
    });
  }, []);

  useEffect(() => {
    getActivities();
  }, [getActivities]);
  if (activities.length === 0) {
    return (
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    );
  }
  return (
    <div className="home-feed">
      <div className="home-feed-wrapper">
        <div className="activity-list">
          {activities?.map((activity, id) => (
            <Link
              style={{ textDecoration: "none" }}
              to={`/volunteer/${activity.id}`}
            >
              <Card key={id} style={{ width: "25rem" }}>
                <Card.Img
                  alt="activity"
                  style={{ height: "15rem" }}
                  className="activity-image"
                  variant="top"
                  src={
                    activity.file === ""
                      ? process.env.PUBLIC_URL + "images/default-volunteer.png"
                      : activity.file
                  }
                />

                <Card.Body>
                  <Card.Title>{activity.name}</Card.Title>
                </Card.Body>
                <Card.Footer>
                  <p className="text-muted">
                    Start: {activity?.startDate.toDate().toDateString()}{" "}
                  </p>
                  <p className="text-muted">
                    End: {activity?.endDate.toDate().toDateString()}{" "}
                  </p>
                </Card.Footer>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeFeed;
