import React, { useState } from "react";
import PropTypes from "prop-types";
import { setTimeStamp } from "../context/dbContext";

const CreateRestockedItem = ({ poi, db, setIsLoading, createdBy }) => {
  const [label, setLabel] = useState("");
  const [day, setDay] = useState("");
  const [votesUp, setVotesUp] = useState(0);
  const [votesDown, setVotesDown] = useState(0);

  async function setNewRestocked(payload) {
    //send set request to firebase
    setIsLoading(true);
    db.collection("Location")
      .doc(poi)
      .collection("restockingTime")
      .add(payload);
    setIsLoading(false);
  }

  //if this state gets anymore complex move to useReducer
  const handleChange = e => {
    const { name, type, value } = e.target;
    const inputValue = type === "number" ? parseFloat(value) : value;
    return name === "label" ? setLabel(inputValue) : setDay(inputValue);
  };

  const handleSubmit = event => {
    event.preventDefault();
    //send request to mapbox
    const created = setTimeStamp();
    const payload = { label, day, createdBy, votesUp, votesDown, created };
    setNewRestocked(payload);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Label:</label>
      <input type="text" name="label" onChange={handleChange}></input>
      <label>Restocking Day</label>
      <select name="day" onChange={handleChange} required>
        <option value="">Select a day</option>
        <option value="sunday">Sunday</option>
        <option value="monday">Monday</option>
        <option value="tuesday">Tuesday</option>
        <option value="wednesday">Wednesday</option>
        <option value="thursday">Thursday</option>
        <option value="friday">Friday</option>
        <option value="saturday">Saturday</option>
      </select>
      <button type="submit">submit</button>
    </form>
  );
};

CreateRestockedItem.propTypes = {
  day: PropTypes.string
};

export default CreateRestockedItem;
