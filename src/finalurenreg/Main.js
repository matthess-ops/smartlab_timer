import { db } from "../firebase";
import React, { useState, useEffect } from "react";
import moment from 'moment';
import Timer from './Timer';
// import UrenOverzicht from './UrenOverzicht'
import * as firebase from 'firebase';
import './Main.css';



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

    const [userID, setUserID] = useState("user_id_two"); //tijdelijke eigen input
    const [projectID, setProjectID] = useState("project_two"); // tijdelijke eigen input
    const [todayDate, setTodayDate] = useState(moment().format("DD-MM-YYYY")); // tijdeljke eigen input, zodat ik met de datums kan spelen 
    const [lastUIState, setLastUIState] = useState("dummy");// kan zijn startUI,pauseUI,hervattenUI en stopUI
    const [lastState, setLastState] = useState("dummy"); // kan zijn start,stop,hervat,pause
    const [timerState, setTimerState] = useState("dummy"); //running of notrunning
    const [ lastTimeStamp, setLastTimeStamp] = useState("dummy"); // unixtime
    const [totalTimePausedToday, setTotalTimePausedToday] = useState(0);// in seconds
    const [totalTimeWorkedToday, setTotalTimeWorkedToday] = useState(0);// in seconds
    const [earliestTimestampForToday, setEarliestTimestampForToday] = useState(0);// in seconds


    // check als het project bestaat indien dit niet geval is het project
    // en de benodigde velden aanmaken. Dit is nodig omdat je anders errors krijgt omdat
    // de velden niet bestaan
    const checkIfProjectExistAndAddProjectData=()=>
    {


        db.collection(USER_COL).doc(userID).collection(PROJECTEN_COL).doc(projectID)
        .onSnapshot(function(doc) {
            if (doc.exists == false)
            {
                addProjectData();
                addTodayTotalsTimes();
            }
      
            
        })

    }



    //nieuw project toevoegen aan project array
    
    const addProjectToDbArray=()=>
    {

        var washingtonRef = db.collection(USER_COL).doc(userID);
        washingtonRef.update({
            allProjectNames: firebase.firestore.FieldValue.arrayUnion(projectID)
        });
        
    }
    //voegt per project per dag de benodigde velden toe, wederom nodig ivm errors
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

    //voegt per project de onderstaande velden toe
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
    // set up snap shot voor een aantal velden uit de database
    const getFireStoreProjectData=()=> // 
    {
       
        db.collection(USER_COL).doc(userID).collection(PROJECTEN_COL).doc(projectID)
        .onSnapshot(function(doc) {
            if (doc.exists== true)
            {
            setLastUIState(doc.data().lastUIState); // usestate is niet nodig hier, usestate alleen gebruiken voor velden die er toe doen.
            setLastState(doc.data().lastState);
            setTimerState(doc.data().timerState);
            setLastTimeStamp(doc.data().lastTimeStamp);
            }
     
        });
    }

    //set up snapshot voor tijd gewerkt/paused velden uit de database
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
    // voor elke nieuwe entry aan een project/datum checken als de nieuwe entry de vroegste starttijd is.
    // zodoende ja update database. Dit is nodig om in het uren overzicht de starttijd nodig is. Dit had
    // ook gekunt door alle project/datum entries te checken voor de vroegste starttijd, maar dit zou
    // potentieel voor een bult reads zorgen.
    const checkForEarliesTimestampForToday =()=>
    {
        const currentTimeUnix = moment().unix();
        const dateString = moment().format("DD-MM-YYYY");
        if(earliestTimestampForToday ==0) 
        {
            var projectData =  db.collection(USER_COL).doc(userID).collection(PROJECTEN_COL).doc(projectID)
        .collection(DAGEN_DATA_COL).doc(dateString);

        return projectData.update({
            earliestTimestampForToday:currentTimeUnix


        })
        .then(function() {
            console.log("Document successfully updated!");
        })
        .catch(function(error) {
            console.error("Error updating document: ", error);
        });
        }
    }
    // useeffect met lege array zodat ie maar 1 keer gerunt wordt.
    // je kan meerdere useeffects gebruiken dus dit is eigenlijk niet nodig.
    useEffect(() => {
        checkIfProjectExistAndAddProjectData();
        addTodayTotalsTimes();
        getFireStoreProjectData();
        getFireStoreProjectDateData();



     
      },[]);



      // update de database voor uistate en als timer running/nonrunning is. Is nodig zodat
      // na minimizing/sluiten van de browser gevolgt door een nieuwe opening/focus van de browser
      // de browser weet welke ui er getoond dient te worden en als timer running/non running is
      const updateFireStoreProjectData =(lastUIStateIN,lastStateIN,timerStateIN)=>
    {
        var projectData = db.collection(USER_COL).doc(userID).collection(PROJECTEN_COL).doc(projectID);

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
            console.error("Error updating document: ", error);
        });
            }

      // voegt een project/datum entry toe aan de database.
      // er is voor entries gekozen zodat dit het aantal writes verminderd tov van elke minuut een firestore counter te incrementen voor tijd gewerkt/pauze en de timer zou ook niet lopen wanneer de page niet actief is
    // ook blijft voor entries de starttijd en eindtijd en als er gewerkt of pauze is gehouden intact. Waardoor je een overzicht kan maken
    // van wanneer er is gewerkt.
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

    // voeg voor elke nieuwe entry het aantal seconden pauze gehouden toe aan project/datum
    const addTotalPauze =(inputSec,dateToAddEntry)=>
    {
        var projectData =  db.collection(USER_COL).doc(userID).collection(PROJECTEN_COL).doc(projectID)
        .collection(DAGEN_DATA_COL).doc(dateToAddEntry);

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
    // voeg voor elke nieuwe entry het aantal seconden gewerkt toe aan project/datum
    // -deze functie samenvoegen met addtotalpauze want zijn praktisch hetzelfde

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
            console.error("Error updating document: ", error);
        });
            
    }


  

    //Als een user vergeten is om uit te klokken aan het eind van de werkdag. En als dit meer dan x uur is geweest. Wordt
    //de tijd niet meegerekend.
    const checkForLastStateErrors =()=>
 
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

   // het kan zijn dat er over middennacht is gewerkt/pauze is gehouden. Dus dan moet de tijd gewerkt/pauze verdeeld
   //worden over deze twee dagen. Aka twee datums moeten een entry krijgen, de dag van vandaag 24:00 tot de tijd currentaction.
   //De dag van gisteren de tijd van prevAction tot 24:00. Ook moeten de juiste actie types bepaald worden.
    const addTimeDataEntry =(isWorked,currentAction)=> // true is worked false is pause

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
        if (prevDate != currentDate) // er is over middennacht gewerkt dus twee entries aanmaken 1 voor vandaag en 1 van gisteren
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
        else{ // binnen de dezelfde dag gewerkt dus maar 1 entry  aanmaken

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

    
    //bepalen welke actie (gewerkt/pauze) er is gedaan na het pressen van start,pauze,hervatten, stop knop. Dit is natuurlijk afhankelijk
    // van de vorige acties. De volgende 4 acties bestaan.

    // vorige knop actie is start, nieuwe knop actie pauze betekend dat er gewerkt is
    // vorige knop actie is pauze, nieuwe knop actie hervatten betekend dat er pauze is gehouden
    // vorige knop actie is start, nieuwe knop actie stop betkend dat er gewerkt is
    // vorige knop actie is pauze, nieuwe knop actie stop betkend dat er pauze is gehouden

    //in de ideale wereld zou een gebruiker alleen maar 1 start en stop actie op een werkdag doen en meerdere pauze/hervatten acties
    // echter kan je hier niet van uit gaan dus je moet rekening houden met meerdere start en stop acties op een dag.


    const startPress=()=>{ // er kan maar 1 lastState zijn en dat is stop
        updateFireStoreProjectData(PAUSEUI,START_STATE,RUNNING_TIMERSTATE);
        checkForEarliesTimestampForToday(); // eerste start van vandaag nemen starttijd van vandaag


    }

    const pausePress=()=>{ // er kan maar 1 lastState zijn en dat is start

        if (lastState == START_STATE) // de tijd tussen lastState start en pausePress betekend dus dat er gewerkt is
        {
          if(checkForLastStateErrors() == false) // dus niet meer dan 8 uur tussen lastState changes geweest dus van uit gaan dat de entry legit is
          {
            
            addTimeDataEntry(true,PAUSE_STATE)// true doen om dat er gewerkt is en pause doen omdat door de pausePress de lastState pause wordt

          }
      
        }

        updateFireStoreProjectData(HERVATTENUI,PAUSE_STATE,NONRUNNING_TIMERSTATE); // ui state veranderen na hervatten state. timer op non running zetten want er wordt pauze gehouden

    }
    const hervattenPress=()=>{  // er kan maar 1 lastState zijn en dat is pause

        if(lastState == PAUSE_STATE) // de tijd tussen lastState pause en hervattenpress betekend dat er pauze is gehouden
        {
            addTimeDataEntry(false,HERVATTEN_STATE )// true doen om dat er gewerkt is en pause doen omdat door de pausePress de lastState pause wordt

        }

        updateFireStoreProjectData(PAUSEUI,START_STATE,RUNNING_TIMERSTATE); // ui state weer op pauze state zetten. timer weer op running zetten want er wordt weer gewerkt

        
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
    <div className="KlokBackGroundOuterOuter" >
    <div className="KlokBackGroundOuter" >
        <p style={{color: "white",fontSize: 9}}>INKLOKKEN</p>

        <Timer inputTime = {totalTimeWorkedToday} inputTimerState = {timerState} inputTimestamp= {lastTimeStamp}/>

        <div className="ButtonDiv">
        {lastUIState ===STARTUI ? <div><button className="StartButton" onClick={startPress} >Start</button></div>     :""}  
        {lastUIState ===PAUSEUI ? <div> <button className="PauzeButton"  onClick={pausePress} >Pauze</button><button className="StopButton"  onClick={stopPress}>Stop</button></div>     :""}
        {lastUIState ===HERVATTENUI ? <div><button className="HervattenButton" onClick={hervattenPress} >Hervatten</button><button className="StopButton" onClick={stopPress} >Stop</button></div>      :""}
        </div>
        
        </div>
    </div>
  );
}

export default Main
