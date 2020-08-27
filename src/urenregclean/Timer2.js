import React, { useState, useEffect } from "react";
import moment from 'moment';


function Timer(props) { 



    let [timerState, setTimerState] = useState(null); //running of notrunning
    let [timeStampLastAction, setTimeStampLastAction] = useState(null); //running of notrunning
    let [timeWorked, setTimeWorked] = useState(0); //running of notrunning
    let [prevTimeWorked, setPrevTimeWorked] = useState(null); //running of notrunning


    var checkIfPropsChanged= () => {
        if (prevTimeWorked!= props.timeWorked)
        {
            console.log("props changed ",props.timeWorked,props.timerState,props.timeStampLastAction)
            setTimerState(timerState=>props.timerState)
            setTimeStampLastAction(timeStampLastAction=>props.timeStampLastAction)
            setTimeWorked(timeWorked=>props.timeWorked)
            setPrevTimeWorked(props.timeWorked)

            if(props.timerState =="running")
            {
                let runTimeElapsed = moment().unix()-props.timeStampLastAction
                setTimeWorked(timeWorked=>timeWorked +runTimeElapsed)

            }
        }
   
    }

    useEffect(() => { 
    
        const timer = setTimeout(() => {
      setTimeWorked(timeWorked => timeWorked+ 1);   
      checkIfPropsChanged()
    }, 1000);
        return () => clearTimeout(timer);
      });


    return (
        <div>
    
        <p>het doet</p>
    
        <div>{timerState}</div>
        <div>{timeStampLastAction}</div>
        <div>{timeWorked}</div>
    
    
    
    
    
    
        
        </div>
      );
}

export default Timer
