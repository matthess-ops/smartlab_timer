import { db } from "../firebase";
import React, { useState, useEffect } from "react";
import moment from 'moment';
import * as firebase from 'firebase';
import 'moment/locale/nl';  // moment tijd na nederlands zetten
import './urenoverzichtdrie.css';


const USER_COL = "users";
const PROJECTEN_COL = "projecten";
const DAGEN_DATA_COL = "dagen_data";




function UrenOverzichtDrie() {
    const [userID, setUserID] = useState("user_id_two");

    const [dataArrayOutput,setDataArrayOutput]= useState([]);
    var dataArray =[];
    var projectArray =[];

 
    // een array aanmaken met daarin objecten van de laatste 6 dagen.
    const fillDataArray =()=>
    {
     
            var i
        for (i = 0; i < 6; i++) { 

            let prevDate = moment().subtract(i, "days").format("DD-MM-YYYY");
            let dateFormatted = moment().locale('nl').subtract(i, "days").format('dddd DD MMM')  

            dataArray.push({date:prevDate,startTime:100000000000000,totalWorked:0,totalPaused:0,formattedDate:dateFormatted})
        

        }
        getProjectNames()
    }
    //retrieved een lijst van lopende projeten uit de database
    const getProjectNames =()=>{

        var docRef = db.collection(USER_COL).doc(userID);

        docRef.get().then(function(doc) {
            if (doc.exists) {
                projectArray =doc.data().allProjectNames
                getAllDAta(projectArray)
          
            } else {
              
            }
        }).catch(function(error) {
            console.log("Error getting document:", error);
        });

    }

    // voor alle projecten wordt voor de laatste 6 dagen gecheckt als er data is. Er wordt het totaal aantal uur/min gewerkt over alle projecten
    // voor de dagen berekend en wat de vroegste starttijd is.
    const getAllDAta =(projectArray)=>{
        
      
            
        var i;
        for (i = 0; i < dataArray.length; i++) {

            var j;
        for (j = 0; j < projectArray.length; j++) { //projecten

            var docRef = db.collection(USER_COL).doc(userID).collection(PROJECTEN_COL).doc(projectArray[j])
            .collection(DAGEN_DATA_COL).doc(dataArray[i].date);
            docRef.get().then(function(doc) {
                if (doc.exists) {
                        

                    // console.log("Document data:", doc.data());
            

                    var indexDate = moment.unix(doc.data().earliestTimestampForToday).format("DD-MM-YYYY")
                    const theIndex = (element) => element.date ==indexDate;
                    var indexNumber =dataArray.findIndex(theIndex)



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
                    
                    setDataArrayOutput(dataArrayOutput=>copydataArray)


               
                } else {
                    // doc.data() will be undefined in this case
                    console.log("No such document!");
                }
            }).catch(function(error) {
                console.log("Error getting document:", error);
            });

        }
    }
    }
    //genereer het aantal uur/min gewerkt output string
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

    // als er vandaag niet gewerkt is return "00:00"
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


  

    function Todo({ dataElement}) {
        return (
            // return data als table rij
            <tr> 
            <td>{convertStartTime(dataElement.startTime)} </td>
            <td> {convertToSec(dataElement.totalWorked)}</td>
            <td style={{textAlign:"right"}}>{dataElement.formattedDate}  </td>
            </tr>


     
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



