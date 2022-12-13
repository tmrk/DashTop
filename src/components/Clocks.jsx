import { useEffect, useState } from 'react'

export default function Clocks() {

  const [time, setTime] = useState('00:00');
  const [timeOffset, setTimeOffset] = useState('00:00');

  useEffect(() => {
    setInterval(() => {
      const dateObject = new Date();
      const hour = dateObject.getHours();
      const minute = dateObject.getMinutes();
      //const second = dateObject.getSeconds();
      const currentTime = hour.toString().padStart(2, '0') + ':' + minute.toString().padStart(2, '0');

      const dateOffsetObject = new Date(dateObject.getTime() + (dateObject.getTimezoneOffset() * 60 * 1000) + (60 * 60 * 1000));
      const hourOffset = dateOffsetObject.getHours();
      const minuteOffset = dateOffsetObject.getMinutes();
      //const secondOffset = dateOffsetObject.getSeconds();
      const offsetTime = hourOffset.toString().padStart(2, '0') + ':' + minuteOffset.toString().padStart(2, '0');
      setTime(currentTime);
      setTimeOffset(offsetTime);
    }, 1000)
  }, []);

  return (
    <div id='clocks'>
      <div className='cph'>
        <span>CPH</span>
        <time>{ timeOffset }</time>
      </div>
      <div className='ktm'>
        <span>KTM</span>
        <time>{ time }</time>
      </div>
    </div>
  );
}