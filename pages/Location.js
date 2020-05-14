import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import firebase from "../firebase/clientApp";
import CreateRestockedItem from "../components/CreateRestockedItem";
import UpdateRestockedItem from "../components/UpdateRestockedItem";
import { useUser } from "../context/userContext";
import { useDb } from "../context/dbContext";
import RestokedItem from "../components/RestokedItem";
import Link from "next/link";

const Location = () => {
  const { user } = useUser();
  const { db } = useDb();
  const router = useRouter();
  const [restockedTimes, setRestockedTimesState] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [id, setId] = useState("");

  const getRestockedTimes = async () => {
    try {
      setId(
        router.query.id ||
          new URLSearchParams(router.asPath.replace("/Location?", "")).get("id")
      );
      const restockedCollection = db
        .collection("Location")
        .doc(id)
        .collection("restockingTime");
      const snapshot = await restockedCollection.get();

      const snapshotData = snapshot.docs.map(item => {
        const data = item.data();
        data.document = item.id;

        return data;
      });
      setRestockedTimesState(snapshotData);
    } catch {
      setIsLoading(false);
      //error
    }
  };

  useEffect(() => {
    setIsLoading(true);
    getRestockedTimes();
    setIsLoading(false);
  }, [restockedTimes, id]);

  const handleShowAddNew = event => {
    event.preventDefault();
  };

  const handleDelete = (e, id, item) => {
    e.preventDefault();
    setIsLoading(true);
    db.collection("Location")
      .doc(id)
      .collection("restockingTime")
      .doc(item)
      .delete();
    setIsLoading(false);
  };

  const renderRestockedItems = restockedTimes => {
    return restockedTimes.map(item => (
      <RestokedItem
        item={item}
        handleDelete={handleDelete}
        id={id}
        user={user}
        key={item.created.toMillis()}
      />
    ));
  };

  const ListMarkupStates = (isLoading, restockedTimes) => {
    if (isLoading) return <li>Loading...</li>;
    if (restockedTimes.length === 0) {
      return (
        <li>
          There are no times for this location.{" "}
          <Link href="/login">
            <a>Login</a>
          </Link>{" "}
          to add one.
        </li>
      );
    } else {
      return renderRestockedItems(restockedTimes);
    }
  };

  return (
    <div>
      <h1>{router.query.title}</h1>
      <p>{router.query.address}</p>
      {/* creates a new restockingTime  */}
      {user && (
        <>
          <a href="" onClick={handleShowAddNew}>
            Add New +
          </a>{" "}
          create:{" "}
          <CreateRestockedItem
            poi={router.query.id}
            restockedTimes={restockedTimes}
            setIsLoading={setIsLoading}
            db={db}
            createdBy={user.uid}
          />
        </>
      )}
      <ul>{ListMarkupStates(isLoading, restockedTimes)}</ul>
    </div>
  );
};

export default Location;
