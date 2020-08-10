import { db } from "../firebase";
import React, { useState, useEffect } from "react";
import moment from 'moment';
import Timer from './Timer';
import UrenOverzicht from './UrenOverzicht'
import * as firebase from 'firebase';


const GEWERKT = "gewerkt";
const PAUSE = "pauze";
const STARTUI = "startUI";
const PAUSEUI = "pauseUI";
const HERVATTENUI ="hervattenUI";
const START_STATE= "start";
const PAUSE_STATE = "pause";
const HERVATTEN_STATE = "hervatten";
const STOP_STATE = "stop";
const RUNNING_TIMERSTATE = "running";
const NONRUNNING_TIMERSTATE ="notrunning";

const USER_COL = "users";
const PROJECTEN_COL = "projecten";
const DAGEN_DATA_COL = "dagen_data";


function Main() {

    const [userID, setUserID] = useState("user_id_two");
    const [projectID, setProjectID] = useState("project_two");
    const [todayDate, setTodayDate] = useState("10-08-2020");
    const [lastUIState, setLastUIState] = useState("dummy");// kan zijn startUI,pauseUI,hervattenUI en stopUI
    const [lastState, setLastState] = useState("dummy"); // kan zijn start,stop,hervat,pause
    const [timerState, setTimerState] = useState("dummy"); //running of notrunning
    const [ lastTimeStamp, setLastTimeStamp] = useState("dummy"); // unixtime
    const [totalTimePausedToday, setTotalTimePausedToday] = useState(0);// in seconds
    const [totalTimeWorkedToday, setTotalTimeWorkedToday] = useState(0);// in seconds
    const [earliestTimestampForToday, setEarliestTimestampForToday] = useState(0);// in seconds


    const checkIfProjectExistAndAddProjectData=()=>
    {


        db.collection(USER_COL).doc(userID).collection(PROJECTEN_COL).doc(projectID)
        .onSnapshot(function(doc) {
            if (doc.exists == false)
            {
                addProjectData();
                addTodayTotalsTimes();
                // createProjectListArray();
            }
      
            
        })

    }

    const createProjectListArray =()=>
    {
        
        db.collection(USER_COL).doc(userID).set(

            {
                allProjectNames:[]
            
            }
        )

    
        .then(function() {
            console.log("Document successfully written!");
        })
        .catch(function(error) {
            console.error("Error writing document: ", error);
        });  
    }



    const addProjectToDbArray=()=>
    {

        var washingtonRef = db.collection(USER_COL).doc(userID);

        // Atomically add a new region to the "regions" array field.
        washingtonRef.update({
            allProjectNames: firebase.firestore.FieldValue.arrayUnion(projectID)
        });
        
    }

    const addTodayTotalsTimes=()=>
    {
        db.collection(USER_COL).doc(userID).collection(PROJECTEN_COL).doc(projectID).collection(DAGEN_DATA_COL).doc(todayDate)
        .onSnapshot(function(doc) {


            if (doc.exists ==false )
            {
                db.collection(USER_COL).doc(userID).collection(PROJECTEN_COL).doc(projectID).collection(DAGEN_DATA_COL).doc(todayDate).set(

                    {
                        totalTimePausedToday:0,
                        totalTimeWorkedToday:0,
                        earliestTimestampForToday:0
                    }
                )
        
              
                .then(function() {
                    console.log("Document successfully written!");
                })
                .catch(function(error) {
                    console.error("Error writing document: ", error);
                });            }
      
            
        })
    }

    const addProjectData=()=>
    {

        var docData = {
            lastUIState:STARTUI,
            lastState:STOP_STATE,
            timerState: NONRUNNING_TIMERSTATE,
            lastTimeStamp: moment().unix()
        };

        db.collection(USER_COL).doc(userID).collection(PROJECTEN_COL).doc(projectID).set(docData)

      
        .then(function() {
            console.log("Document successfully written!");
        })
        .catch(function(error) {
            console.error("Error writing document: ", error);
        });



  


    }

    const getFireStoreProjectData=()=> // 
    {
       
        db.collection(USER_COL).doc(userID).collection(PROJECTEN_COL).doc(projectID)
        .onSnapshot(function(doc) {
            // var source = doc.metadata.hasPendingWrites ? "Local" : "Server";
            console.log("getFireStoreProjectData snapshot");
            if (doc.exists== true)
            {
            setLastUIState(doc.data().lastUIState);
            setLastState(doc.data().lastState);
            setTimerState(doc.data().timerState);
            setLastTimeStamp(doc.data().lastTimeStamp);
            }
     
        });
    }


    const getFireStoreProjectDateData=()=> // 
    {
       
        db.collection(USER_COL).doc(userID).collection(PROJECTEN_COL).doc(projectID)
        .collection(DAGEN_DATA_COL).doc(todayDate)
        .onSnapshot(function(doc) {
            var source = doc.metadata.hasPendingWrites ? "Local" : "Server";
            if(doc.exists == true)
            {
            setTotalTimeWorkedToday(doc.data().totalTimeWorkedToday);
            setTotalTimePausedToday(doc.data().totalTimePausedToday);
            setEarliestTimestampForToday(doc.data().earliestTimestampForToday);
            }
     
        });
    }

    const checkForEarliesTimestampForToday =()=>
    {
        const currentTimeUnix = moment().unix();
        const dateString = moment().format("DD-MM-YYYY");
        if(earliestTimestampForToday ==0) 
        {
            var projectData =  db.collection(USER_COL).doc(userID).collection(PROJECTEN_COL).doc(projectID)
        .collection(DAGEN_DATA_COL).doc(dateString);

        // Set the "capital" field of the city 'DC'
        return projectData.update({
            earliestTimestampForToday:currentTimeUnix


        })
        .then(function() {
            console.log("Document successfully updated!");
        })
        .catch(function(error) {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
        });
        }
    }

    useEffect(() => {

        //checkForLastStateErrors moet ik nog even fixen morgen

        // console.log(checkForLastStateErrors());
        // createProjectListArray()
        // console.log("main useeffect thingy")
        // addProjectToDbArray();
        // createProjectListArray();

        checkIfProjectExistAndAddProjectData();
        addTodayTotalsTimes();

        getFireStoreProjectData();
        getFireStoreProjectDateData();



     
      });
    {/* <p>lastUIState= {lastUIState} lastUIStateChange= {lastState} timerState= {timerState} </p> */}


    const updateFireStoreProjectData =(lastUIStateIN,lastStateIN,timerStateIN)=>
    {
        var projectData = db.collection(USER_COL).doc(userID).collection(PROJECTEN_COL).doc(projectID);

        // Set the "capital" field of the city 'DC'
        return projectData.update({
            lastUIState:lastUIStateIN,
            lastState:lastStateIN,
            timerState: timerStateIN,
            lastTimeStamp: moment().unix()


        })
        .then(function() {
            console.log("Document successfully updated!");
        })
        .catch(function(error) {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
        });
            }


    

    const addEntryToTime_data=(actionTypeIn,ActionTypeTimeIn,curActionIn,curActionTimeStampIn,prevActionIn,prevActionTimeStampIn,dateToAddEntry)=>{

        db.collection(USER_COL).doc(userID).collection(PROJECTEN_COL).doc(projectID)
        .collection(DAGEN_DATA_COL).doc(dateToAddEntry).collection("time_data").add({
            actionType:actionTypeIn,
            ActionTypeTime:ActionTypeTimeIn,
            curAction:curActionIn,
            curActionTimeStamp:curActionTimeStampIn,
            prevAction:prevActionIn,
            prevActionTimeStamp:prevActionTimeStampIn 

        })
        .then(function(docRef) {
            console.log("Document written with ID: ", docRef.id);
        })
        .catch(function(error) {
            console.error("Error adding document: ", error);
        });

    }

    const addTotalPauze =(inputSec,dateToAddEntry)=>
    {
        var projectData =  db.collection(USER_COL).doc(userID).collection(PROJECTEN_COL).doc(projectID)
        .collection(DAGEN_DATA_COL).doc(dateToAddEntry);

        // Set the "capital" field of the city 'DC'
        return projectData.update({
            totalTimePausedToday:totalTimePausedToday+inputSec


        })
        .then(function() {
            console.log("Document successfully updated!");
        })
        .catch(function(error) {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
        });
            
    }

    const addTotalWorked =(inputSec,dateToAddEntry)=>
    {
        var projectData =  db.collection(USER_COL).doc(userID).collection(PROJECTEN_COL).doc(projectID).collection(DAGEN_DATA_COL).doc(dateToAddEntry);

        return projectData.update({
            totalTimeWorkedToday:totalTimeWorkedToday+inputSec


        })
        .then(function() {
            console.log("Document successfully updated!");
        })
        .catch(function(error) {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
        });
            
    }


  


    const checkForLastStateErrors =()=>
    // Het kan natuurlijk voorkomen dat iemand is vergeten uit te klokken uit een pauze of een start. Aka lastState is dan pause of start.
    //Als dit meer dan x uur is geweest Laat zeggen 8 uur. De volgende hervattenPress of stopPress niet mee berekenen.
    {
        let calcSecsGewerkt =moment().unix()-lastTimeStamp;
        if (calcSecsGewerkt >= 8*3600)
        {
            return true;
        }
        else{
            return false;
        }

    }

    const testfuncties =()=>{

        console.log("moment unix ",moment().unix());
        console.log("date.gettime ",new Date().getTime())

        // var getYesterdayMidnightMinOneSecond = (moment().startOf('day').subtract(1, 'seconds').unix());
        // var datenew = new Date().getTime()
        // console.log(datenew);
        // console.log("new datate ",new Date.getTime(),"getYesterdayMidnightMinOneSecond ",getYesterdayMidnightMinOneSecond," ",moment().startOf('day').subtract(1, 'seconds'))

    }

    const addTimeDataEntry =(isWorked,currentAction)=> // true is worked false is pause
    // eerste checken als er niet over middennacht is gewerkt. Indien wel moeten er werk entries over meerdere
    //dagen aangemaakt worden.
    {
        let actionType = new String; // gewerkt of pauze van maken
        if (isWorked == true)
        {
            actionType = GEWERKT;
        }
        else{
            actionType= PAUSE ;
        }
        let ActionTypeTime = moment().unix()- lastTimeStamp;
        let curAction = currentAction;
        let curActionTimeStamp = moment().unix()
        let prevAction = lastState;
        let prevActionTimeStamp = lastTimeStamp;


        let prevDate = moment.unix(lastTimeStamp).format("DD-MM-YYYY");
        let currentDate = moment().format("DD-MM-YYYY");
        if (prevDate != currentDate) // er is over middennacht gewerkt
        {
            var getYesterdayMidnightMinOneSecond = moment().startOf('day').subtract(1, 'seconds').unix();
            var YesterdayActionTypeTime = getYesterdayMidnightMinOneSecond - prevActionTimeStamp;
            var getYesterdayDate = moment().startOf('day').subtract(1, 'seconds').format("DD-MM-YYYY"); // vervangen door prevDate
            // dus aan time_ data van gisteren wordt een entry geplaats waar curActionTimeStamp de datum van gisteren om middennacht is min 1 gesconden
            addEntryToTime_data(actionType,YesterdayActionTypeTime,curAction,getYesterdayMidnightMinOneSecond,prevAction,prevActionTimeStamp,getYesterdayDate );
            if (actionType == GEWERKT)
            {
                addTotalWorked(YesterdayActionTypeTime,getYesterdayDate)
            }
            if (actionType == PAUSE )
            {
                addTotalPauze(YesterdayActionTypeTime,getYesterdayDate)
            }
        

            // deze shit hier in in verwerken.
            // const [totalTimePausedToday, setTotalTimePausedToday] = useState("dummy");// in seconds
            // const [totalTimeWorkedToday, setTotalTimeWorkedToday] = useState("dummy");// in seconds

            var getYesterdayMidnightPlusOneSecond = moment().startOf('day').add(1, 'seconds').unix();
            var TodayActionTypeTime = curActionTimeStamp-getYesterdayMidnightPlusOneSecond;
            // dus aan time-data van vandaag wordt een entry geplaast waar prevActionTimeStamp de datum van gisteren om middennacht plus 1 seconden is
            addEntryToTime_data(actionType,TodayActionTypeTime,curAction,curActionTimeStamp,prevAction,getYesterdayMidnightPlusOneSecond,todayDate);
            if (actionType == GEWERKT)
            {
                addTotalWorked(TodayActionTypeTime,todayDate)
            }
            if (actionType == PAUSE )
            {
                addTotalPauze(TodayActionTypeTime,todayDate)
            }
        
    

        }
        else{ // binnen de dezelfde dag gewerkt

            addEntryToTime_data(actionType,ActionTypeTime,curAction,curActionTimeStamp,prevAction,prevActionTimeStamp,todayDate);
            if (actionType == GEWERKT)
            {
                addTotalWorked(ActionTypeTime,todayDate)
            }
            if (actionType == PAUSE )
            {
                addTotalPauze(ActionTypeTime,todayDate)
            }
        }

        
    }




    const startPress=()=>{ // er kan maar 1 lastState zijn en dat is stop
        updateFireStoreProjectData(PAUSEUI,START_STATE,RUNNING_TIMERSTATE);
        checkForEarliesTimestampForToday(); // eerste start van vandaag nemen als 


    }

    const pausePress=()=>{ // er kan maar 1 lastState zijn en dat is start

        if (lastState == START_STATE) // de tijd tussen lastState start en pausePress betekend dus dat er gewerkt is
        {
          if(checkForLastStateErrors() == false) // dus niet meer dan 8 uur tussen lastState changes geweest dus van uit dat de entry legit is
          {
            
            addTimeDataEntry(true,PAUSE_STATE)// true doen om dat er gewerkt is en pause doen omdat door de pausePress de lastState pause wordt

          }
      
        }

        updateFireStoreProjectData(HERVATTENUI,PAUSE_STATE,NONRUNNING_TIMERSTATE);

    }
    const hervattenPress=()=>{  // er kan maar 1 lastState zijn en dat is pause

        if(lastState == PAUSE_STATE) // de tijd tussen lastState pause en hervattenpress betekend dat er pauze is gehouden
        {
            addTimeDataEntry(false,HERVATTEN_STATE )// true doen om dat er gewerkt is en pause doen omdat door de pausePress de lastState pause wordt

        }

        updateFireStoreProjectData(PAUSEUI,START_STATE,RUNNING_TIMERSTATE); 

        
    }

    const stopPress=()=>{ // er kunnen twee laststates zijn dat is start of pause


        if(lastState == START_STATE) // de tijd tussen tussen lastState start en stopPress betekend dat er gewerkt is
        {
            addTimeDataEntry(true,STOP_STATE)// true doen om dat er gewerkt is en pause doen omdat door de pausePress de lastState pause wordt

        }else if(lastState == PAUSE_STATE){ // de tijd tussen lastState pause en stopPress betekend dat er pauze is gehouden/niet gewerkt
            addTimeDataEntry(false,STOP_STATE)// nu wordt de tijd berekend als pauze. Echter valt er iets van te zeggen dat gebruiker besloten heeft om na de pauze te besluiten om te stoppen met werken dat deze tijd niet als pauze berekend dient te worden.

        }

        updateFireStoreProjectData(STARTUI,STOP_STATE,NONRUNNING_TIMERSTATE);


    }
    

  

     

  

  return (
    <div>
    <p>current unix={moment().unix()}</p>
    <p>unix min 23 uur={moment().unix()-(23*3600)}</p>
    <p>userID= {userID} projectID= {projectID} todayDate= {todayDate}</p>
    <p>lastUIState= {lastUIState} lastState= {lastState} timerState= {timerState} lastTimeStamp={lastTimeStamp}</p>
    <p>totalTimePausedToday= {totalTimePausedToday} totalTimeWorkedToday= {totalTimeWorkedToday}</p>


    <Timer inputTime = {totalTimeWorkedToday} inputTimerState = {timerState} inputTimestamp= {lastTimeStamp}/>



    <b>{lastUIState ===STARTUI ? <div><button onClick={startPress} >Start</button></div>      :""}</b>
    <b>{lastUIState ===PAUSEUI ? <div><button onClick={pausePress} >Pauze</button><button onClick={stopPress}>Stop</button></div>      :""}</b>
    <b>{lastUIState ===HERVATTENUI ? <div><button onClick={hervattenPress} >Hervatten</button><button onClick={stopPress} >Stop</button></div>      :""}</b>


    <UrenOverzicht/>
    
    </div>
  );
}

export default Main
