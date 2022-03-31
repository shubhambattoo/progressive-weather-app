import { useEffect, useState } from 'react';
import DataService from '../api/dataService';
import './Forecasts.css';

const HourlyUpdates = ({ data, timings }) => {
  const [nextHours, setNextHours] = useState([]);
  const [tempUnit] = useState('°c'); //  F
  const [sunTimings, setSunTimings] = useState([]);

  useEffect(() => {
    const formatted = data.map((hour) => ({
      dateTime: DataService.getDateTime(hour.dt),
      ...hour,
    }));
    setNextHours(formatted);
    const t = timings.map((t) => ({
      d: new Date(t * 1000).toLocaleDateString('en-US'),
      t: new Date(t * 1000).toLocaleTimeString('en-US'),
    }));

    setSunTimings(t);
  }, [data, timings]);

  // useEffect(() => {
  //   const t = timings.map((t) => ({
  //     d: new Date(t * 1000).toLocaleDateString('en-US'),
  //     t: new Date(t * 1000).toLocaleTimeString('en-US'),
  //   }));

  //   setSunTimings(t);
  // }, [timings]);

  const isDarkHour = (dt) => {
    const d = new Date(dt * 1000).toLocaleDateString('en-US');
    const day = sunTimings.filter((t) => t.d === d);
    if (day.length === 2) {
      const min = new Date(`${d} ${day[0].t}`);
      const max = new Date(`${d} ${day[1].t}`);
      return dt * 1000 > min && dt * 1000 < max ? false : true;
    } else {
      return false;
    }
  };

  return (
    <div className="hourly-updates">
      <div className="header">Next 48 Hour</div>
      <div className="scroll-wrapper">
        {nextHours.map((hour, i) => (
          <div
            className={isDarkHour(hour.dt) ? 'hour dark' : 'hour'}
            key={`hr${i + 1}`}
          >
            <div className="time">
              {hour.dateTime.time}
              <span>{isDarkHour(hour.dt)}</span>
            </div>
            <div className="icon">
              <img
                src={`https://openweathermap.org/img/wn/${hour.weather[0].icon}.png`}
                alt={hour.weather[0].main}
              />
            </div>
            <div className="weather">
              <div>
                <span>
                  {Math.round(hour.temp)}
                  {tempUnit}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HourlyUpdates;
