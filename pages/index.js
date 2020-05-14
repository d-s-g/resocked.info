import Head from "next/head";
import Link from "next/link";
import React, { useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const mapboxGeoToken = {
  mapboxApiAccessToken: process.env.MAPBOX_API_ACCESS_TOKEN
};

const Index = props => {
  const [data, setData] = useState([]);
  const [inputValue, setValue] = useState({});

  async function fetchData(query) {
    const result = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/groceries%20${query}.json?country=us&limit=10&access_token=${mapboxGeoToken.mapboxApiAccessToken}`
    );

    const json = await result.json();

    await setData(json.features.map(store => store));
  }

  const handleChange = e => {
    const { name, type, value } = e.target;
    const inputValue = type === "number" ? parseFloat(value) : value;
    setValue({ [name]: inputValue });
  };

  const handleSubmit = e => {
    e.preventDefault();
    //send request to mapbox
    fetchData(inputValue.zip);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          <input
            type="number"
            name="zip"
            onChange={handleChange}
            required
            placeholder="Enter a zip"
          />
        </label>
        <input type="submit" value="Submit" />
        <ul>
          {data.map(item => (
            <li key={item.id}>
              <Link
                href={{
                  pathname: "/Location",
                  query: {
                    id: item.id.replace("poi.", ""),
                    title: item.text,
                    address: item.properties.address
                  },
                  shallow: true
                }}
              >
                <a>{item.place_name}</a>
              </Link>
            </li>
          ))}
        </ul>
      </form>
      <Link href="/login">
        <a>Login</a>
      </Link>
    </div>
  );
};

Index.propTypes = {
  inputValue: PropTypes.number
};

export default Index;
