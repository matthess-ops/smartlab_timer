import { db } from "./firebase";
import React, { useState, useEffect } from "react";



function Urenreg() {
  // Declare a new state variable, which we'll call "count"


  const [tijdgewerkt, setTijdGewerkt] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);




  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds(seconds => seconds + 1);
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);
  
   

//   useEffect(() => {
//     db.collection("testurenreg").doc("user_one")
//     .onSnapshot(function(doc) {
//         var source = doc.metadata.hasPendingWrites ? "Local" : "Server";
//         setTijdGewerkt(doc.data().tijdgewerkt)
        
//     });
//   });




//   const addTijd = () => {
//     // setCount(count + 1)
//     db.collection("testurenreg").doc("user_one").set({
//       tijdgewerkt:tijdgewerkt+10 })
//   .then(function() {
//       console.log("Document successfully written!");
//   })
//   .catch(function(error) {
//       console.error("Error writing document: ", error);
//   });

//   };




  return (
    <div>
        <p>tijdgewerkt = {setSeconds}</p>

    {/* <button onClick={addTijd}>Add to db</button> */}

     </div>
  );
}

export default Urenreg
