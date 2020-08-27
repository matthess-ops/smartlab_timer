import React, { useState, useEffect } from "react";
import Timer from './Timer2'


function Main(props) { 

    // let timerState = "running"; //running not running
    // let timeStampLastAction = 1598514942;
    // let timeWorked = 10

    const [timerState, setTimerState] = useState("running"); //running of notrunning
    const [timeStampLastAction, setTimeStampLastAction] = useState(1598514942); //running of notrunning
    const [timeWorked, setTimeWorked] = useState(0); //running of notrunning


    const increaseTimer=()=>{ // er kunnen twee laststates zijn dat is start of pause

        setTimeWorked(timeWorked =>timeWorked+10);
        console.log("main timeworkd =",timeWorked)

        


    }



    return (
        <div>
    
        <div><button className="increase timers" onClick={increaseTimer} >Start</button></div>
        <Timer timeStampLastAction = {timeStampLastAction} timerState = {timerState} timeWorked= {timeWorked}/>

    
    
    
    
    
    
        
        </div>
      );
}

export default Main
