import { useEffect, useState } from 'react'
import { DateTime } from 'luxon';

const timeZones = [
  {name: 'CPH', zone: 'Europe/Copenhagen'},
  {name: 'KTM', zone: 'Asia/Kathmandu'}
];

export default function Clocks() {

  const [clocks, setClocks] = useState(timeZones);

  const updateClocks = () => {
    const newClocks = [];
    for (let i = 0; i < clocks.length; i++) {
      const clock = clocks[i];
      clock.time = DateTime.local().setZone(clock.zone).toFormat('H:mm');
      newClocks.push(clock);
    }
    setClocks(newClocks); 
  };

  useEffect(() => {
    updateClocks();
    const interval = setInterval(() => {
      updateClocks();
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div id='clocks'>
      {
        clocks.map((clock, index) => (
          <div key={index} className='clock'>
            <span>{ clock.name }</span>
            <time>{ clock.time }</time>
          </div>
        ))
      }
    </div>
  );
}