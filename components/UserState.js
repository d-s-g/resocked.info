import React from "react";
import firebase from "../firebase/clientApp";
import { useUser } from "../context/userContext";
import { useDb } from "../context/dbContext";

const handleLogout = () => {
  //should inform user of loggout
  return firebase.auth().signOut();
};

const UserState = () => {
  const { user } = useUser();
  const { db } = useDb();

  const handleLogin = async () => {
    const { user } = await firebase
      .auth()
      .signInWithPopup(new firebase.auth.GoogleAuthProvider());
    await createUser(db, user.uid, user.displayName, user.email);
  };

  function createUser(db, uid, name, email) {
    //send set request to firebase
    try {
      db.collection("Users")
        .doc(uid)
        .set({ name, email });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      {user ? <p>loggedin</p> : <p>loggedout</p>}
      <button onClick={handleLogin}>Login</button>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default UserState;
