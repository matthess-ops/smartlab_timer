import { db } from "../firebase";
import React, { useState, useEffect } from "react";



function Unsub() { 


    let unsubscribe;
    const subCheck=()=>
    {

        unsubscribe =db.collection("checkunsub").doc("testdoc")
        .onSnapshot(function(doc) {
            console.log("Current data: ", doc.data());
        });
        
    }

        
    const doeunsub=()=>
    {
        return () => {unsubscribe.unsubscribe();


        }    
    
    }

    


    useEffect(() => {
        subCheck()


        return () => {unsubscribe();
        }
      },[]);



    return (
        <div>
    
        <p>check runnning</p>
        <div><button className="check unsub" onClick={doeunsub} >unsub</button></div>

    
        
        </div>
      );

    }
export default Unsub
