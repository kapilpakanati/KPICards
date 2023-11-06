import React, { Fragment, useState, useEffect } from 'react';
import KFSDK from "@kissflow/lowcode-client-sdk";
import { KPICardComponent } from "./KPICard"; 

function App() {
  const [kf, setKf] = useState();

  useEffect(() => {
    setTimeout(() => {
      loadKfSdk();
    }, 200);
  }, []);

  async function loadKfSdk() {
    let kf = await KFSDK.initialize();
    window.kf = kf;
    setKf(kf);
  }
   
  return <Fragment>{kf && <KPICardComponent />}</Fragment>; 
  //return <Fragment>{ <KPICardComponent />}</Fragment>; 

}
   

export default App;
