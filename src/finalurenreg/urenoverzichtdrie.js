import { db } from "../firebase";
import React, { useState, useEffect } from "react";
import moment from 'moment';
import Timer from './Timer';
import * as firebase from 'firebase';
import 'moment/locale/nl';  // without this line it didn't work
import './urenoverzichtdrie.css';



const GEWERKT = "gewerkt";
const PAUSE = "pauze";
const STARTUI = "startUI";
const PAUSEUI = "pauseUI";
const HERVATTENUI = "hervattenUI";
const START_STATE = "start";
const PAUSE_STATE = "pause";
const HERVATTEN_STATE = "hervatten";
const STOP_STATE = "stop";
const RUNNING_TIMERSTATE = "running";
const NONRUNNING_TIMERSTATE = "notrunning";

const USER_COL = "users";
const PROJECTEN_COL = "projecten";
const DAGEN_DATA_COL = "dagen_data";





function UrenOverzichtDrie() {
    const [userID, setUserID] = useState("user_id_two");

    const [dataArrayOutput,setDataArrayOutput]= useState([]);
    // const [projectArray,setProjectArray]= useState([])
    var dataArray =[];
    var projectArray =[];
    var test ="peeeep"

 

    const fillDataArray =()=>
    {
     
            var i
        for (i = 0; i < 6; i++) { //dagen

            let prevDate = moment().subtract(i, "days").format("DD-MM-YYYY");
            let dateFormatted = moment().locale('nl').subtract(i, "days").format('dddd DD MMM')  
            console.log('dateFormatted ',dateFormatted) 

            dataArray.push({date:prevDate,startTime:100000000000000,totalWorked:0,totalPaused:0,formattedDate:dateFormatted})
        

        }
        getProjectNames()
    }

    const getProjectNames =()=>{

     

        var docRef = db.collection(USER_COL).doc(userID);

        docRef.get().then(function(doc) {
            if (doc.exists) {
                // console.log("Document data:", doc.data().allProjectNames);
                projectArray =doc.data().allProjectNames
                getAllDAta(projectArray)
          
            } else {
              
            }
        }).catch(function(error) {
            // console.log("Error getting document:", error);
        });

    }


    const getAllDAta =(projectArray)=>{
        
      
            // console.log("fucking go",dataArray)
            // console.log('waarom is kut array leeg ',projectArray)
        var i;
        for (i = 0; i < dataArray.length; i++) {

            // console.log('i=',i,'dataArray[i] ',dataArray[i]) // dit werkt niet nu is dataArray[i] undefined
            var j;
        for (j = 0; j < projectArray.length; j++) { //projecten

            // console.log("getalldata  dataarray".)
            var docRef = db.collection(USER_COL).doc(userID).collection(PROJECTEN_COL).doc(projectArray[j])
            .collection(DAGEN_DATA_COL).doc(dataArray[i].date);
            docRef.get().then(function(doc) {
                if (doc.exists) {
                                // console.log('le fuck i=',i,'dataArray[i] ',dataArray[i]) // dit werkt niet nu is dataArray[i] undefined
                                // omdat dit kut async is dus wanneer de data binne is staat i dus al op 5 voor alle indexes
                                //voor de datum van vandaag index 0 is er data dus

                    console.log("Document data:", doc.data());
                    // console.log("doc.data().totalTimeWorkedToday ",doc.data().totalTimeWorkedToday)
                    // console.log("GODVERDOMME ",i)

                    var indexDate = moment.unix(doc.data().earliestTimestampForToday).format("DD-MM-YYYY")
                    // console.log('doc.data().earliestTimestampForToday = ',doc.data().earliestTimestampForToday,'goodindex ', indexDate)
                    const theIndex = (element) => element.date ==indexDate;
                    var indexNumber =dataArray.findIndex(theIndex)
                    console.log('indexNumber',indexNumber);



                    var earliestStarted;
                    
                    var newTotalWorked = dataArray[indexNumber].totalWorked+doc.data().totalTimeWorkedToday;
                    var newTotalPaused= dataArray[indexNumber].totalPaused+doc.data().totalTimePausedToday

                    if(doc.data().earliestTimestampForToday<dataArray[indexNumber].startTime)
                    {
                        earliestStarted= doc.data().earliestTimestampForToday
                    }
                    else{
                        earliestStarted=dataArray[indexNumber].startTime
                    }

                    

                    var copydataArray =[...dataArray]

                    copydataArray[indexNumber].startTime = earliestStarted
                    copydataArray[indexNumber].totalWorked= newTotalWorked
                    copydataArray[indexNumber].totalPaused =newTotalPaused
                    copydataArray[indexNumber].dateFormatted =copydataArray[indexNumber].dateFormatted
                    
                    // setDataArray(dataArray=>copydataArray)
                    setDataArrayOutput(dataArrayOutput=>copydataArray)


               
                } else {
                    // doc.data() will be undefined in this case
                    // console.log("No such document!");
                }
            }).catch(function(error) {
                // console.log("Error getting document:", error);
            });

        }
    }
    }

    const convertToSec = (inputSec)=>
    {
        let hours = Math.floor(inputSec/3600)
        let mins = Math.floor((((inputSec/3600)-hours)*60))
        let hoursString =''
        let minsString =''
        if (hours <10)
        {
            if (hours ==0)
            {
                hoursString ='00'
            }
            else{
                hoursString ='0'+String(hours)

            }

        }
        else{
            hoursString= String(hours)
        }


        if (mins <10)
        {

            if (mins ==0)
            {
                minsString ='00'
            }
            else{
                minsString ='0'+String(mins)

            }


        }
        else{
            minsString= String(mins)
        }
        let hoursMinsString = hoursString+':'+minsString
        return hoursMinsString
    }

    const convertStartTime = (inStartTime)=>{

        if (inStartTime != 100000000000000)
        {
            return moment.unix(inStartTime).format("HH:MM")

        }
        else{
            return "00:00"
        }
    }



    useEffect(() => {
        fillDataArray()

        },[] );


  

// {convertToSec(dataElement.totalPaused)} //{dataElement.date}
    function Todo({ dataElement}) {
        return (
            <tr>
            <td>{convertStartTime(dataElement.startTime)} </td>
            <td> {convertToSec(dataElement.totalWorked)}</td>
            <td style={{textAlign:"right"}}>{dataElement.formattedDate}  </td>
            </tr>


        //   <div>
        //        {convertStartTime(dataElement.startTime)}    {convertToSec(dataElement.totalWorked)} {dataElement.formattedDate} 
        //   </div>
        );
      }
  

    return (
        <div className="BackBackGroundKleur">
            <div className= "BackGroundKleur">
                <p style={{color: "white",fontSize: 15, textAlign:"left",marginLeft:8}}> Urenoverzicht</p>
                
        <table className = "TableStyle">

        <tr>
        <th>Starttijd</th>
        <th>Aantal uren</th>
        <th style={{textAlign:"right"}} >Datum</th>
        </tr>

        {dataArrayOutput.map((todo, index) => (
          <Todo
        
            dataElement={todo}
      
          />
        ))}



        </table>
        </div>
        </div>

    );

}

export default UrenOverzichtDrie



