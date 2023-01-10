import { useEffect, useState } from 'react'
import { ReactComponent as IcFace } from '../assets/ic-face-red.svg'

export default function AirData() {

  return (
    <div id='airdata'>
      <div id='aqi'>
        <div className='left'>
          <span className='title'>US AQI</span>
          <span className='value'>136</span>
        </div>
        <div className='right'>
          <IcFace />
        </div>
      </div>
      <div className='flexcolumn'>
        <div id='temperature'>
          <span className='title'>Temperature: </span>
          <span className='value'>22&#176;C</span>
        </div>
        <div id='humidity'>
          <span className='title'>Humidity: </span>
          <span className='value'>45%</span>
        </div>
      </div>      
    </div>
  );

}




//https://api.airvisual.com/v2/city?city=Kathmandu&state=Central%20Region&country=Nepal&key={process.env.REACT_APP_AIRVISUAL_KEY}


