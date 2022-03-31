import { useEffect, useState } from 'react';
import DataService from '../api/dataService';
import './Forecasts.css';

const Next7Days = ({ data }) => {
  const [upcomingDays, setUpcomingDays] = useState([]);
  const [tempUnit] = useState('°c'); //  F

  useEffect(() => {
    data.shift();
    const formatted = data.map((day) => {
      day.sunrise = DataService.getDateTime(day.sunrise, 'time');
      day.sunset = DataService.getDateTime(day.sunset, 'time');
      day.date = DataService.getDateTime(day.dt, 'date');
      day.weekday = DataService.getWeekDay(day.dt);
      return day;
    });

    setUpcomingDays(formatted);
  }, [data]);

  return (
    upcomingDays.length && (
      <div className="days-7">
        <div className="header">7 days forecast</div>
        <div className="scroll-wrapper">
          {upcomingDays.map((day, i) => (
            <div className="day" key={`day${i + 1}`}>
              <div className="name">
                {day.weekday}
                <span>{day.date}</span>
              </div>
              <div className="icon">
                <img
                  src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                  alt={day.weather[0].main}
                />
              </div>
              <div className="weather">
                <div>
                  <span className="temp H">
                    {Math.round(day.temp.max)} {tempUnit}
                  </span>
                  <span className="temp L">
                    {Math.round(day.temp.min)} {tempUnit}
                  </span>
                </div>
                <div>
                  <span>Humidity</span>
                  <span>{day.humidity}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  );
};

export default Next7Days;
