import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

const UpdateRestockedItem = ({
  id,
  db,
  document,
  label,
  day,
  setIsLoading
}) => {
  const [newLabel, setNewLabel] = useState("");
  const [newDay, setNewDay] = useState("");

  async function setNewRestocked(payload) {
    //send set request to firebase
    setIsLoading(true);
    db.collection("Location")
      .doc(id)
      .collection("restockingTime")
      .doc(document)
      .set(payload, {
        merge: true
      });
    setIsLoading(false);
    //update restockedTimes state
  }

  //if this state gets anymore complex move to useReducer
  const handleChange = e => {
    const { name, type, value } = e.target;
    const inputValue = type === "number" ? parseFloat(value) : value;
    return name === "label" ? setNewLabel(inputValue) : setNewDay(inputValue);
  };

  const handleSubmit = event => {
    event.preventDefault();

    const payload = { label: newLabel, day: newDay };
    setNewRestocked(payload);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Label:</label>
      <input
        type="text"
        name="label"
        onChange={handleChange}
        defaultValue={label}
      ></input>
      <label>Restocking Day</label>
      <select name="day" onChange={handleChange} required defaultValue={day}>
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

UpdateRestockedItem.propTypes = {
  day: PropTypes.string
};

export default UpdateRestockedItem;
