import { db } from "./firebase";
import React, { useState, useEffect } from "react";
import TestUrenRegTimer from './TestUrenRegTimer'


function TestUrenRegMain() {

    const [timeWorked, setTimeWorked] = useState("dummy");
    const [timerState,setTimerState] = useState("dummy");
    const [uiState,setUiState] = useState("dummy");
    const [lastTimestamp,setLastTimestamp] = useState("dummy");


 

    const checkTimerState = () => {
        db.collection("testurenreg").doc("2kFyKr0Ov6dIxuWNLWK5")
        .onSnapshot(function(doc) {
            var source = doc.metadata.hasPendingWrites ? "Local" : "Server";
            setTimerState(doc.data().timerState);
            setUiState(doc.data().uiState);
            setLastTimestamp(doc.data().lastTimestamp.seconds);

            
        });
    
      }

    const checkTimeWorked =()=>{
    
            db.collection("testurenreg").doc("2kFyKr0Ov6dIxuWNLWK5").collection("dagen").doc("01-08-2020")
            .onSnapshot(function(doc) {
                var source = doc.metadata.hasPendingWrites ? "Local" : "Server";
                setTimeWorked(doc.data().tijdgewerkt)
                
            });

    }


  
   

    useEffect(
        () => {checkTimerState();checkTimeWorked()}
    );






  return (
    <div>
        <p>main meuk</p>
        <p>time workd is {timeWorked}</p>

    <TestUrenRegTimer inputTime = {timeWorked} inputTimerState = {timerState} inputTimestamp= {lastTimestamp}/>



    
    </div>
  );
}

export default TestUrenRegMain
