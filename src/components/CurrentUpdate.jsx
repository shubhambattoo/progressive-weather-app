import { useState } from 'react';
import { useEffect } from 'react';
import DataService from '../api/dataService';
import './Forecasts.css';

const CurrentUpdate = ({ data, dailydata, timings, miniview, name }) => {
  const [minView, setMinView] = useState(miniview);
  const [tempUnit] = useState('°c'); //  F
  const [windSpeedUnit] = useState('mt/s'); // miles/hour
  const [windDirection, setWindDirection] = useState(null);
  const [tempData] = useState(dailydata.temp);
  const [rainChance] = useState(dailydata.rain);

  useEffect(() => {
    setMinView(miniview);
  }, [miniview]);

  useState(() => {
    const direction = DataService.getCardinalDirection(data.wind_deg);
    setWindDirection(direction);
  }, [data]);

  const darkIcons = ['01n', '13d', '13n', '50d', '50n'];

  return (
    <div className={minView ? 'current-place min' : 'current-place'}>
      <div className="highlight">
        <div className="location">{name}</div>
        <div className="temp">
          <span> {data.temp}</span>
          <sup>{tempUnit}</sup>
        </div>
        <div
          className={`icon ${
            darkIcons.includes(data.weather[0].icon) ? 'inv' : ''
          }`}
        >
          <img
            className="city-icon"
            src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`}
            alt={data.weather[0].main}
          />
        </div>
      </div>
      <div className="more-info">
        <div className="description">
          <span className="w">
            {data.weather[0].main} ({data.weather[0].description}), Feels like{' '}
            {data.feels_like}
            {tempUnit}
          </span>
          {data.rain && <span>Rain: {data.rain['1h']}mm (in last 1hr)</span>}
        </div>
        <div className="humid">Humidity: {data.humidity}%</div>
        <div className="wind">
          {windDirection} {data.wind_speed} {windSpeedUnit}
        </div>
        <div className="temp">
          <span>
            <small>HI</small>
            {tempData.max}
            <sup>{tempUnit}</sup>
          </span>
          <span>
            <small>LO</small>
            {tempData.min}
            <sup>{tempUnit}</sup>
          </span>
        </div>
      </div>
      <div className="city">
        {data.dt < data.sunrise && (
          <div>
            <span className="icon sunrise"></span>
            <p>
              Sunrise
              <strong>{DataService.getDateTime(data.sunrise, 'time')}</strong>
            </p>
          </div>
        )}
        {data.dt >= data.sunrise && data.dt < data.sunset && (
          <div>
            <span className="icon sunset"></span>
            <p>
              Sunset
              <strong>{DataService.getDateTime(data.sunset, 'time')}</strong>
            </p>
          </div>
        )}
        {data.dt >= data.sunset && (
          <div>
            <span className="icon sunrise"></span>
            <p>
              Sunrise
              <strong>{DataService.getDateTime(timings[2], 'time')}</strong>
            </p>
          </div>
        )}
        <div>
          <span className="icon uv"></span>
          <p>
            UV Index <strong>{data.uvi}</strong>{' '}
          </p>
        </div>
        <div>
          <span className="icon vis"></span>
          <p>
            Visibility <strong>{Math.round(data.visibility / 1000)} km</strong>
          </p>
        </div>
        <div>
          <span className="icon press"></span>
          <p>
            Air Pressure <strong>{data.pressure} hPa</strong>
          </p>
        </div>
        <div>
          <span className="icon cloud"></span>
          <p>
            Cloudiness <strong>{data.clouds}%</strong>{' '}
          </p>
        </div>
        <div>
          <span className="icon rain"></span>
          <p>
            Chances of Rain <strong>{Math.round(rainChance * 100)} %</strong>{' '}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CurrentUpdate;
