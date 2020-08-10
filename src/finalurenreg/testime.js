import React, { useState, useEffect } from "react";


function Testtime() {



  

  const [datas, setDatas] = useState([
    {
      id:   1,
      name: 'john',
      gender: 'm'
    },
    {
      id:   2,
      name: 'mary',
      gender: 'f'
    }
]);

const testfunctie =()=>
{



  setDatas(datas => datas.concat({id:4,name:"frits",gender:"adfsd"}))
  console.log(datas)


}


   
 
    

  return (
    <div>
      <p>asdfsadfdaf</p>

      <button onClick={()=>testfunctie()} >Start</button>
    </div>
  );
}

export default Testtime

