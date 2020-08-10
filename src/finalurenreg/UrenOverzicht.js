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


function UrenOverzicht() {

    const [userID, setUserID] = useState("user_id_two");
  
    const [projectNames, setProjectNames] = useState(["empty"]);

    const[totTimeWorked, setTotTimeWorked]= useState([0,0,0,0,0,0])

    const[dayOneData,setDayOneData]= useState([0,0,0,0])
    const[counter,setCounter]= useState(0)

    // const[datas, setDatas] = useState([])


    const [datas, setDatas] = useState([
        {
          date:   1,
          name: 'john',
          gender: 'm'
        },
        {
         date:   2,
          name: 'mary',
          gender: 'f'
        }
    ]);
    



 



    const getProjectNames = () => // 
    {

        db.collection(USER_COL).doc(userID)
            .onSnapshot(function (doc) {

                if (doc.exists == true) {
                    
                    getData(doc.data().allProjectNames)


                }

            });
        


    }


    const getData = (projectNames) => {
       
        var i;
        for (i = 0; i < 5; i++) { //dagen




            let prevDate = moment().subtract(i, "days").format("DD-MM-YYYY");
            console.log("prevDAte ",prevDate)


            let dateStart = "dummy";
            let dateTotalTimeWorked = 0;
            let dateTotalTimePaused = 0;
            let dateString = moment().subtract(i, "days").format('dddd DD MMM')

            setDatas(datas => datas.concat({date:prevDate,dateString:dateString,dateTotalTimeWorked:0,dateTotalTimePaused:0}))

            var j;
            for (j = 0; j < projectNames.length; j++) { //projecten

                var docRef = db.collection(USER_COL).doc(userID).collection(PROJECTEN_COL).doc(projectNames[j])
                    .collection(DAGEN_DATA_COL).doc(prevDate);

                docRef.get().then(function (doc) {
                    if (doc.exists) {
                    
                        
                   
                        dateTotalTimeWorked =dateTotalTimeWorked+ doc.data().TotalTimeWorkedToday
                        dateTotalTimePaused =dateTotalTimePaused+doc.data().dateTotalTimePaused

                        if (dateStart == "dummy") {
                            dateStart = doc.data().earliestTimestampForToday
                        }
                        else if (doc.data().earliestTimestampForToday < dateStart) {
                            dateStart = doc.data().earliestTimestampForToday

                        }
                        console.log("doc.data().TotalTimeWorkedToday ",doc.data().TotalTimeWorkedToday)
                        setCounter(counter => counter+1)

                  
                      

                    } else {
                        // doc.data() will be undefined in this case
                        console.log("No such document!");
                    }
                }).catch(function (error) {
                    console.log("Error getting document:", error);
                });


                ///////////////
                // let dateStartToString = moment().unix(dateStart).format().format("HH:SS")


            }
            // console.log("ALS TWEEDED")

            if(dateStart !="dummy"){
                console.log("dateStartToString ",dateStart)
                console.log("dateTotalTimeWorked ", dateTotalTimeWorked)
                console.log("dateTotalTimePaused ",dateTotalTimePaused)
                console.log("dateString ",dateString)
                console.log("      ")

            }
  



        }
        console.log(datas)
    }


    const allowedState = [
        { testcounter: 0, secs: 0 },
        { testcounter: 3, secs: 0 }
      ];

      const [count, setCount] = useState(0);

      const [stateValues, setStateValues] = useState(0);

    useEffect(() => {

        getProjectNames();
        // // getData();

        // console.log(allowedState[0].testcounter)
        // setCounter(count+1)
        // console.log("lafack ",count)
        // setStateValues(10)
        // console.log("lefuck ",stateValues)


    },[]);







        // const data =[{"name":"test1"},{"name":"test2"}];
        return (
          <div>
          {datas.map(function(d, idx){
             return (<li key={idx}>{d.date}</li>)
           })}
          </div>
        );
}

export default UrenOverzicht


// setDatas(datas => datas.concat({date:prevDate,dateString:dateString,dateTotalTimeWorked:0,dateTotalTimePaused:0}))


// render() {
//     const data =[{"name":"test1"},{"name":"test2"}];
//     return (
//       <div>
//       {data.map(function(d, idx){
//          return (<li key={idx}>{d.name}</li>)
//        })}
//       </div>
//     );
//   }
