import React, { useEffect, useCallback, useState } from "react";
import "./certificates.css";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase/firebase";
import { ref, listAll, getDownloadURL } from "firebase/storage";
import { storage } from "../../firebase/firebase";

const Certificate = () => {
  const [urlList, setUrlList] = useState([]);
  const fetchUser = useCallback(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const listRef = ref(storage, `certificates/${user.uid}/`);

        // Find all the prefixes and items.
        listAll(listRef)
          .then((res) => {
            res.items.forEach((itemRef) => {
              getDownloadURL(itemRef).then((url) => {
                setUrlList((data) => [...data, url]);
              });
            });
          })
          .catch((error) => {});
      }
    });
  }, []);
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);
  return (
    <div className="certificate-page">
      <div className="certificate-page-wrapper">
        <div className="certificate-list">
          {urlList?.map((item, id) => (
            <img
              key={id}
              className="certificate-picture"
              alt="certificate"
              src={item}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Certificate;
