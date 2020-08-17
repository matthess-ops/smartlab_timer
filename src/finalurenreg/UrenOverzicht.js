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
    const [counter, setCounter] = useState(0)

    // var [datas, setDatas] = useState([]);
    var [timeWorked, setTimeWorked] = useState(0);


    var [datas, setDatas] = useState({ date: "07-08-2020", earliest: 1000000000000000000000000000, worked: 0, paused: 0 });









    const getProjectNames = () => // 
    {

        db.collection(USER_COL).doc(userID)
            .onSnapshot(function (doc) {

                if (doc.exists == true) {
                    // console.log("wat")

                    // setDatas(datas =>datas.concat({     date: 'lefuck',
                    //     earliest: 'lefuck',
                    //     totalWorked:  'lefuck',
                    //     totalPaused:  'lefuck'}))
                    // console.log(datas)
                    // console.log(doc.data().allProjectNames)

                    test(doc.data().allProjectNames)



                }

            });



    }

    const nieuw = () => {

        var docRef = db.collection(USER_COL).doc(userID);

        docRef.get().then(function (doc) {

            if (doc.exists) {
                console.log(doc.data().allProjectNames)
                var projectNames = doc.data().allProjectNames;
                var j;
                for (j = 0; j < projectNames.length; j++) { //projecten


                    db.collection(USER_COL).doc(userID).collection(PROJECTEN_COL).doc(projectNames[j])
                        .collection(DAGEN_DATA_COL).doc("07-08-2020")
                        .onSnapshot(function (doc) {
                            if (doc.exists) {
                                console.log('doc.daat',doc.data())
                                console.log('datas',datas)
                                

                                if(datas.earliest >doc.data().earliestTimestampForToday)
                                {
                                    var copyofdatas ={...datas}

                                    console.log("doc.data.earlies is smaller dan datas")
                                    copyofdatas.earliest =doc.data().earliestTimestampForToday
                                    setDatas(copyofdatas)
                                    console.log("copyofdatas ",copyofdatas)
                                    console.log("after setting of datas ",datas)
                                    console.log("---------------")

                                }

                             


                                // datas.forEach(element => {
                                //     console.log("le fuck ",element)
                                //     if (element.date =="07-08-2020"){
                                //         if (element.earliest > doc.data().earliestTimestampForToday) {
                                //             element.earliest = doc.data().earliestTimestampForToday
                                //             console.log("eerlier found")
                                //         }

                                //     }

                                // })
                            }


                        }
                        )



                }

            }



        })




    }


    const testtwee = (projectNames) => {


        var i;
        for (i = 0; i < 5; i++) { //dagen

            let prevDate = moment().subtract(i, "days").format("DD-MM-YYYY");

            var j;
            for (j = 0; j < projectNames.length; j++) { //projecten



                db.collection(USER_COL).doc(userID).collection(PROJECTEN_COL).doc(projectNames[j])
                    .collection(DAGEN_DATA_COL).doc(prevDate)
                    .onSnapshot(function (doc) {
                        if (doc.exists) {
                            console.log("Current data: ", doc.data());

                            var datafound = false
                            var foundDatasInDB = {}

                            datas.forEach(element => {
                                console.log(prevDate, "element data ", element)

                                if (element.date == prevDate) {
                                    console.log(prevDate, "is found")
                                    datafound = true
                                }
                                else {
                                    datafound = false
                                    console.log(prevDate, "not found")

                                }



                            })
                            //
                            if (datafound == false) {
                                console.log("data is not found")
                                var newElement = {
                                    date: prevDate,
                                    earliest: doc.data().earliestTimestampForToday,
                                    totalWorked: doc.data().totalTimeWorkedToday,
                                    totalPaused: doc.data().totalTimePausedToday

                                }
                                setDatas(datas => datas.concat(newElement))
                                console.log("setted datas ", datas)
                            }
                            else {
                                var datasCopy = [...datas]
                                datasCopy.forEach(element => {
                                    if (element.date == prevDate) {
                                        element.totalWorked = element.totalWorked + doc.data().totalTimeWorkedToday;
                                        element.totalPaused = element.totalPaused + doc.data().totalTimePausedToday;

                                        if (element.earliest > doc.data().earliestTimestampForToday) {
                                            element.earliest = doc.data().earliestTimestampForToday
                                        }
                                    }

                                })
                            }


                        }
                    });



            }
        }
        console.log(datas);
    }







    const test = (projectNames) => {


        var i;
        for (i = 0; i < 5; i++) { //dagen

            let prevDate = moment().subtract(i, "days").format("DD-MM-YYYY");

            var j;
            for (j = 0; j < projectNames.length; j++) { //projecten



                db.collection(USER_COL).doc(userID).collection(PROJECTEN_COL).doc(projectNames[j])
                    .collection(DAGEN_DATA_COL).doc(prevDate)
                    .onSnapshot(function (doc) {
                        if (doc.exists) {
                            console.log("Current data: ", doc.data());

                            var datafound = false
                            var foundDatasInDB = {}

                            datas.forEach(element => {
                                console.log(prevDate, "element data ", element)

                                if (element.date == prevDate) {
                                    console.log(prevDate, "is found")
                                    datafound = true
                                }
                                else {
                                    datafound = false
                                    console.log(prevDate, "not found")

                                }



                            })
                            //
                            if (datafound == false) {
                                console.log("data is not found")
                                var newElement = {
                                    date: prevDate,
                                    earliest: doc.data().earliestTimestampForToday,
                                    totalWorked: doc.data().totalTimeWorkedToday,
                                    totalPaused: doc.data().totalTimePausedToday

                                }
                                setDatas(datas => datas.concat(newElement))
                                console.log("setted datas ", datas)
                            }
                            else {
                                var datasCopy = [...datas]
                                datasCopy.forEach(element => {
                                    if (element.date == prevDate) {
                                        element.totalWorked = element.totalWorked + doc.data().totalTimeWorkedToday;
                                        element.totalPaused = element.totalPaused + doc.data().totalTimePausedToday;

                                        if (element.earliest > doc.data().earliestTimestampForToday) {
                                            element.earliest = doc.data().earliestTimestampForToday
                                        }
                                    }

                                })
                            }


                        }
                    });



            }
        }
        console.log(datas);
    }







    useEffect(() => {
        nieuw()






    },[]);







    return (
        <div>
            {counter}
            {/* {datas.map(function (d, idx) {
                return (<li key={idx}>{d.date} {d.earliest} {d.totalWorked} {d.totalPaused}</li>)
            })} */}
            <div>     <button onClick={() => nieuw()} >Start</button>            </div>

            <div>earlist time 07-10-2020 {datas.earliest}</div>
            


        </div>
    );
}

export default UrenOverzicht



