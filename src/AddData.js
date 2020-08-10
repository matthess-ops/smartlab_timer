import React, { useState } from 'react';
import { db } from "./firebase";


function AddData() {
  // Declare a new state variable, which we'll call "count"
  const [count, setCount] = useState(0);
  const [voornaam, setVoornaam] = useState("");
  const [achternaam, setAchternaam] = useState("");

  const wrapperFunction = () => {

    addDataToDB();
  };
  const addDataToDB = () => {
    // setCount(count + 1)
    db.collection("users").doc().set({
      achternaam: achternaam,
      voornaam: voornaam  })
  .then(function() {
      console.log("Document successfully written!");
  })
  .catch(function(error) {
      console.error("Error writing document: ", error);
  });

  };

  return (
    <div>
    <p>Add Data to DataBase</p>

      {/* <p>You clicked {count} times</p> */}
      <input type="text" placeholder="voornaam" onChange={e => setVoornaam(e.target.value)} />
      <input type="text" placeholder="achternaam" onChange={e => setAchternaam(e.target.value)} />

      <button onClick={wrapperFunction}>Add to db</button>
    </div>
  );
}

export default AddData
