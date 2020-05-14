import { useState, useEffect, createContext, useContext } from "react";
import firebase from "../firebase/clientApp";

export const dbContext = createContext();

export default ({ children }) => {
  const [db, setDb] = useState(null);

  const getDb = () => {
    try {
      const db = firebase.firestore();
      setDb(db);
    } catch (error) {
      console.log("database", error);
      // Most probably a connection error. Handle appropiately.
    }
    return () => db();
  };

  useEffect(() => {
    getDb();
  }, []);

  return <dbContext.Provider value={{ db }}>{children}</dbContext.Provider>;
};

export const setTimeStamp = () => firebase.firestore.Timestamp.now();

// Custom hook that shorhands the context!
export const useDb = () => useContext(dbContext);
