import { useState, useEffect, createContext, useContext } from "react";
import firebase from "../firebase/clientApp";

export const userContext = createContext();

export default ({ children }) => {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true); // Helpful, to update the UI accordingly.

  const getUser = () => {
    const unsubscriber = firebase.auth().onAuthStateChanged(async user => {
      try {
        if (user) {
          // User is signed in.
          const { uid, displayName, email, photoURL } = user;
          // You could also look for the user doc in your Firestore (if you have one):
          // const userDoc = await firebase.firestore().doc(`users/${uid}`).get()
          setUser({ uid, displayName, email, photoURL });
        } else setUser(null);
      } catch (error) {
        // Most probably a connection error. Handle appropiately.
        console.log("user", error);
      } finally {
        setLoadingUser(false);
      }
    });

    // Unsubscribe auth listener on unmount
    return () => unsubscriber();
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <userContext.Provider value={{ user, setUser, loadingUser }}>
      {children}
    </userContext.Provider>
  );
};

// Custom hook that shorhands the context!
export const useUser = () => useContext(userContext);
