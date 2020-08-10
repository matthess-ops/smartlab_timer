import React, { useState, useEffect } from "react";


function Timer(props) {

    var [timeWorked, setTimeWorked] = useState(0);
    var [lastInputTime,setLastInputTime] = useState(0);
    var [hoursWorked,setHoursWorked] = useState(0);
    var [minsWorked,setMinsWorked] = useState(0);
    var [hoursMinString,setHoursMinString] = useState("00:00");


    // calc aande hand van timeWorked seconden om hoeveel uur en minuten het gaat
    const calcHoursMins =()=>
    {
        const hoursWorked = timeWorked/3600;
        var decimals = hoursWorked - Math.floor(hoursWorked);
        var fullHours = hoursWorked-decimals;
        setHoursWorked(hoursWorked => fullHours)
        setMinsWorked(minsWorked=>Math.round(decimals*60))
        makeHoursMinString(fullHours,Math.round(decimals*60));
    }


    const makeHoursMinString =(inhours,inmins)=>
    {
        var outputString ="";
        if(inhours <10)
        {
            outputString = outputString+"0"+inhours.toString()+":";
        }
        else{
            outputString = outputString+inhours.toString()+":";

        }

        if(inmins <10)
        {
            outputString = outputString+"0"+inmins.toString();
        }
        else{
            outputString = outputString+inmins.toString();

        }

        setHoursMinString(outputString)
    }
  


    var addTime= () => {
    //   if (lastInputTime != props.inputTime) // als de vorige inputTime niet veranderd deze functie niet herhalen anders wordt de timer continue geresterd met de prop.inputTime en wordt er dus niet geincrement
    //   {
        // calcHoursMins();
        if (props.inputTimerState == "running")
        { // het probleem is als de tabblad is weg geklikt terwijl de timer loopt. Het na het openen
          //van een nieuwe browser weer de tijd wordt gereset naar de tijd die in de database (props.inputTime) staat.
          //nu wordt er gecheckt als de timer running is. Zoedoende ja berekende tijd die verstreken is tussen
          //(props.inputTime) en add die op.
          var curTime = Math.round(new Date().getTime()/1000); // als de inputTimeState running is de tijd sinds laatse props.inputTime berekenen en add deze voordat useeffect begint te tellen
          var diff = curTime-props.inputTimestamp;
     
          setTimeWorked(timeWorked =>props.inputTime+diff);
          calcHoursMins();
        // setLastInputTime(lastInputTime=>props.inputTime); // dus als de tijd in main veranderd is. wordt de timer tijd hier veranderd


        }
        else
        {
          setTimeWorked(timeWorked =>props.inputTime);
          calcHoursMins();
        // setLastInputTime(lastInputTime=>props.inputTime); // dus als de tijd in main veranderd is. wordt de timer tijd hier veranderd


        }

    //   }
    //   else
    //   {
    //     calcHoursMins();
    //     // setLastInputTime(lastInputTime=>props.inputTime); // 

    //   }
    };


   
    // elke keer als de state veranderd wordt useeffect gecalled.
    useEffect(() => { 
      addTime();
      if (props.inputTimerState == "running") // de timer wordt alleen geincrement wanneer er daadwerkelijk gewerkt wordt. Als er pauze (notrunning) is staat de timer stil
      {
      const timer = setTimeout(() => {
    setTimeWorked(timeWorked => timeWorked+ 1);     
      }, 1000);
      return () => clearTimeout(timer);
    }});

    

  return (
    <div>
    <p>tijd gewerkt {timeWorked}</p>
    <p>props.inputTime {props.inputTime} lastInputTime {lastInputTime} </p>

    <p>timerState {props.inputTimerState}</p>
    <p>hoursWorked {hoursWorked}</p>
    <p>minsWorked {minsWorked}</p>
    <p>{hoursMinString}</p>





    
    </div>
  );
}

export default Timer
