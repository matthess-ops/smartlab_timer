import React, { useState, useEffect } from "react";

// {totalTimeWorkedToday} inputTimerState = {timerState} inputTimestamp= {lastTimeStamp}
// props zijn als de timer state running/nonrunning is, totale tijd gewerkt vandaag aan dit project en wanneer de laaste knop actie is verricht.
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

    // genereer de output tijd string
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
  

    //Het probleem is dat na het sluiten van de browser terwijl de timer loopt. Het na het openen van 
    //een nieuwe browser weer de tijd gereset wordt na de input prop tijd. Dit is prima als er pauze
    //wordt gehouden immers de timer dient ook stil te staan. Maar als de timer state running is moet de verstreken
    //tijd tussen de input prop tijd en de current tijd bij de timer opgeteld worden.
    var addTime= () => {

        if (props.inputTimerState == "running")
        { 
          
     
          var curTime = Math.round(new Date().getTime()/1000); // als de inputTimeState running is, moet je de tijd sinds laatse props.inputTime berekenen en add deze voordat useeffect begint te tellen
          var diff = curTime-props.inputTimestamp;
     
          setTimeWorked(timeWorked =>props.inputTime+diff);
          calcHoursMins();


        }
        else
        {
          setTimeWorked(timeWorked =>props.inputTime);
          calcHoursMins();


        }

  
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


    <div style={{color: "white",fontSize: 23}}>{hoursMinString}</div>






    
    </div>
  );
}

export default Timer
