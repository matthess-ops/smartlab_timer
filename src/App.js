import React from 'react';
import logo from './logo.svg';
import './App.css';
// import AddData from './AddData.js'
// import RetrieveData from './RetrieveData.js'
// import Snapshot from './Snapshot'
// import Urenreg from './Urenreg'
// import Loading from './tetscripts'
// import Hookclock from './Hookclock'
// import TestUrenRegTimer from './TestUrenRegTimer'
// import TestUrenRegMain from './TestUrenRegMain'
import Main from './finalurenreg/Main'
// import Testtime from './finalurenreg/testime'
// import UrenOverzich from './finalurenreg/UrenOverzicht'
// import UrenOverzichtTwee from './finalurenreg/urenoverzichttwee'
import UrenOverzichtDrie from './finalurenreg/urenoverzichtdrie'
// import Timer from './urenregclean/Timer2'
// import Main from './urenregclean/Main2'
import Unsub from './urenregclean/unsub'



function App() {
  return (
    <div className="App">
      {/* <RetrieveData/>
      <AddData/>
      <Snapshot/> */}
      {/* <Urenreg/>
      <Loading/> */}
      {/* <Hookclock/> */}
      {/* <TestUrenRegMain/> */}
      <Main/>
      {/* <Testtime/> */}
      {/* <UrenOverzich/> */}
      <UrenOverzichtDrie/>
      {/* {<Main/>} */}
      {/* {<Unsub/>} */}

    </div>
  );
}

export default App;
