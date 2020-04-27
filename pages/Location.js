import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import firebase from "../firebase/clientApp";
import CreateRestockedItem from "../components/CreateRestockedItem";

const Location = () => {
  const router = useRouter();
  const [restockedTimes, setRestockedTimesState] = useState([]);
  const [db, setDb] = useState({});

  useEffect(() => {
    const getRestockedTimes = async () => {
      const id =
        router.query.id ||
        new URLSearchParams(router.asPath.replace("/Location?", "")).get("id");
      const db = firebase.firestore();
      const restockedCollection = db
        .collection("Location")
        .doc(id)
        .collection("restockingTime");
      const snapshot = await restockedCollection.get();

      const snapshotData = snapshot.docs.map(item => {
        const data = item.data();

        return data;
      });
      setDb(db);
      return setRestockedTimesState(snapshotData);
    };
    getRestockedTimes();
  }, []);

  const handleShowAddNew = event => {
    event.preventDefault();
  };

  return (
    <div>
      <h1>{router.query.title}</h1>
      <p>{router.query.address}</p>
      {/* creates a new restockingTime  */}
      <a href="" onClick={handleShowAddNew}>
        Add New +
      </a>
      <CreateRestockedItem id={router.query.id} db={db} />
      {/* Displays restockingtimes */}
      <ul>
        {restockedTimes.map(item => (
          <ol key={item.id}>
            Up:{item.votesUp}/Down: {item.votesDown} - Item: {item.label} -
            Restocking Day: {item.day} - Edit - Delete
          </ol>
        ))}
      </ul>
    </div>
  );
};

export default Location;
