import { db } from "../firebase";
import React, { useState, useEffect } from "react";
import moment from 'moment';
import Timer from './Timer';
import * as firebase from 'firebase';


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





function UrenOverzichtTwee() {
    const [userID, setUserID] = useState("user_id_two");

    const [dataArray,setDataArray]= useState([]);
    const [projectArray,setProjectArray]= useState([])

 

    const fillDataArray =()=>
    {
        
        if (dataArray.length==0)
        {
            var i
        for (i = 0; i < 6; i++) { //dagen

            let prevDate = moment().subtract(i, "days").format("DD-MM-YYYY");

            setDataArray(dataArray =>dataArray.concat({date:prevDate,startTime:0,totalWorked:0,totalPaused:0}))

        }
    }
    }


    const getProjectNames =()=>{

        if (projectArray.length ==0)
        {

        var docRef = db.collection(USER_COL).doc(userID);

        docRef.get().then(function(doc) {
            if (doc.exists) {
                // console.log("Document data:", doc.data().allProjectNames);
                setProjectArray(projectArray=>doc.data().allProjectNames)
                // console.log("getprojectnames projectnames doc.data ",doc.data().allProjectNames)
                // console.log(projectArray)
            } else {
                // doc.data() will be undefined in this case
                // console.log("No such document!");
            }
        }).catch(function(error) {
            // console.log("Error getting document:", error);
        });

    }}

    const getAllDAta =()=>{
        
        if (dataArray.length>0 &&projectArray.length>0)
        {
            // console.log("fucking go")
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

                    // console.log("Document data:", doc.data());
                    // console.log("doc.data().totalTimeWorkedToday ",doc.data().totalTimeWorkedToday)
                    // console.log("GODVERDOMME ",i)

                    var indexDate = moment.unix(doc.data().earliestTimestampForToday).format("DD-MM-YYYY")
                    console.log('doc.data().earliestTimestampForToday = ',doc.data().earliestTimestampForToday,'goodindex ', indexDate)
                    const theIndex = (element) => element.date ==indexDate;
                    var indexNumber =dataArray.findIndex(theIndex)
                    console.log('indexNumber',indexNumber,'dataArray[theIndex]',dataArray[indexNumber])


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
                    setDataArray(dataArray=>copydataArray)

               
                } else {
                    // doc.data() will be undefined in this case
                    // console.log("No such document!");
                }
            }).catch(function(error) {
                // console.log("Error getting document:", error);
            });

        }
    }
    }}


    // const getData =(projectNames)=>
    // {
    //     var j
    //     for (j = 0; j < projectNames.length; j++) { //projecten

    //         var docRef = db.collection(USER_COL).doc(userID).collection(PROJECTEN_COL).doc(projectNames[j])
    //         .collection(DAGEN_DATA_COL).doc("07-08-2020");

    //         docRef.get().then(function(doc) {
    //             if (doc.exists) {
    //                 console.log("Document data:", doc.data());
    //                 if (doc.data().earliestTimestampForToday<earlier)
    //                 {
    //                     setEarlier(doc.data().earliestTimestampForToday)
    //                     // setEarlier(earlier=>200)
    //                     console.log("earliest is ",doc.data().earliestTimestampForToday)
    //                     console.log("earlies after seting is",earlier)
    //                     console.log("allearlier ",allearlier)
    //                     setAllEarlier(allearlier.concat(doc.data().earliestTimestampForToday))
    //                     console.log("-----------")

                
    //                 }
    //             } 
    //         })

    //     }
    // }


    useEffect(() => {
        fillDataArray()
        getProjectNames()
        getAllDAta()

        // console.log("dataarray ",dataArray)
        // console.log("projectArray ",projectArray)

        },[] );




       function Todo({ dataElement}) {
        return (
          <div>
              {dataElement.date} {dataElement.startTime} {dataElement.totalWorked} {dataElement.totalPaused}
          </div>
        );
      }

    return (
        <div>

            {/* <div>dataarray {dataArray}</div> */}
            {/* <div>allearlier {allearlier.length}</div>
            <div> prevearlier {prevearlier}</div>

        
            <div>     <button onClick={() => getProjectNames()} >Start</button>            </div> */}
            {dataArray.map((todo, index) => (
          <Todo
        
            dataElement={todo}
      
          />
        ))}
        )}

            


        </div>
    );

}

export default UrenOverzichtTwee



