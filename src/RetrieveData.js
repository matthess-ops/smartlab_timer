import React, { useState } from 'react';
import { db } from "./firebase";


function RetrieveData() {
  // Declare a new state variable, which we'll call "count"
  const [userinfo, setUserInfo] = useState({ voornaam: 'testvoornaam' ,achternaam:'testachternaam'});
  const [nrofusers, setNrOfUsers] = useState(0);
  const [textboxtext, setTextBoxText] = useState("dummy text");



  const wrapperFunction = () => {
    getUserInfo();
    getNumberOfUsers();

  }

  const getNumberOfUsers= () => {

   db.collection('users').get().then(function(snap)
   {
     const size = snap.size;
     console.log(size);
    setNrOfUsers(size);
   }
   
   );
  };


  const getUserInfo = () => {

      var docRef = db.collection("users").doc("user_one");

    docRef.get().then(function(doc) {
        if (doc.exists) {
            console.log("Document data:", doc.data());
            // setString(doc.data().beh)
            setUserInfo(doc.data())
            console.log(doc.data());


        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });


  };






  return (
    <div>
    <p>Add Data to DataBase</p>


      {<p>retrieve voornaam={userinfo.voornaam} achternaam={userinfo.achternaam} </p>}
      {<p>number of users in collection {nrofusers} </p>}
      {<p>textbox text {textboxtext} </p>}




      <button onClick={wrapperFunction }>
        GetData
      </button>
    </div>
  );
}

export default RetrieveData 
