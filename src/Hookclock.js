import React, { useState, useEffect } from "react";


export default function Hookclock() { //https://stackoverflow.com/questions/53395147/use-react-hook-to-implement-a-self-increment-counter
    const [counter, setCounter] = useState(0);


    useEffect(() => {
      const timer = setInterval(() => {
        setCounter(counter => counter + 1); // <-- Change this line!
      }, 1000);
      return () => {
        clearInterval(timer);
      };
    }, []); // Pass in empty array to run effect only once!
  
    return (
      <div>Count: {counter}</div>
    );
  }



  ////eerste versie

//   export default function Hookclock(){
//     const [counter, setCounter] = useState(0);
  
//     useEffect(() => {
//       const interval = setInterval(() => {
//         setCounter(counter + 1);
//       }, 1000);
  
//       return () => {
//         clearInterval(interval);
//       };
//     });
  
//     return <h1>{counter}</h1>;
//   };