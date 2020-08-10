import { db } from "./firebase";
import React, { useState, useEffect } from "react";



function Snapshot() {
  // Declare a new state variable, which we'll call "count"


  const [username, setUsername] = useState(0);



  useEffect(() => {
    db.collection("users").doc("user_one")
    .onSnapshot(function(doc) {
        var source = doc.metadata.hasPendingWrites ? "Local" : "Server";
        console.log(source, " data: ", doc.data());
        setUsername(doc.data().voornaam)
        
    });
  });




  return (
    <div>
    <p> Snapshot voornaam is {username}</p>


     </div>
  );
}

export default Snapshot 
