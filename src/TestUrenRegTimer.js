import { db } from "./firebase";
import React, { useState, useEffect } from "react";

    {/* <TestUrenRegTimer inputTime = {timeWorked} inputTimerState = {timerState} inputTimestamp= {timestamp}/> */}

function TestUrenRegTimer(props) {

    var [timeWorked, setTimeWorked] = useState(0);
    var [timerState,setTimerState] = useState();
    var [lastInputTime,setLastInputTime] = useState(0);

  


    var boo= () => {

      console.log(props)
      if (lastInputTime != props.inputTime)
      {
        // console.log("lastInputTime=",lastInputTime,"props.inputTime=",props.inputTime)
        setLastInputTime(lastInputTime=>props.inputTime);

        if (props.inputTimerState == "running")
        {
          var curTime = Math.round(new Date().getTime()/1000);
          var diff = curTime-props.inputTimestamp;
     
          


          setTimeWorked(timeWorked =>props.inputTime+diff);

        }
        else
        {
          setTimeWorked(timeWorked =>props.inputTime);

        }

      }
    };


   

    useEffect(() => {
      boo();
      if (props.inputTimerState == "running")
      {
      const timer = setTimeout(() => {
        // console.log('This will run after 1 second!')
        setTimeWorked(timeWorked => timeWorked+ 1); 
        
      }, 1000);
      return () => clearTimeout(timer);
    }});

    

  return (
    <div>
    <p>tijd gewerkt {timeWorked}</p>
    <p>timerState {timerState}</p>


    
    </div>
  );
}

export default TestUrenRegTimer
