import { useState, useEffect } from 'react';
import { useIdleTimer } from 'react-idle-timer';

import Next7Days from './components/Next7Days';
import HourlyUpdates from './components/HourlyUpdates';
import CurrentUpdate from './components/CurrentUpdate';
import Sidebar from './components/Sidebar';
import { fetchCurrentWeather } from './api/fetchWeather';
import DataService from './api/dataService';
import './Weather.css';
import './App.css';

const App = () => {
  const [rawData, setRawData] = useState(null);
  const [bgClass, setBGClass] = useState('');
  const [drawerShown, setDrawerShown] = useState(false);
  const [minimalView, setMinimalView] = useState(true);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [weatherError, setWeatherError] = useState(false);
  const [weatherErrorMsg, setWeatherErrorMsg] = useState(
    'Failed to load data.'
  );
  const [placeName, setPlaceName] = useState('');

  const [currentUpdate, setCurrentUpdate] = useState(null);
  const [hourlyUpdates, setHourlyUpdates] = useState([]);
  const [dailyUpdates, setDailyUpdates] = useState([]);
  const [dailyData, setDailyData] = useState([]);
  const [sunTimings, setSunTimings] = useState([]);

  const handleOnIdle = () => {
    if (!drawerShown) {
      setMinimalView(true);
    }
  };

  useEffect(() => {
    setWeatherLoading(true);
    navigator.geolocation.getCurrentPosition(
      function (position) {
        const place = {
          coord: {
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          },
          name: 'Current location',
        };
        fetchWeather(place);
      },
      (err) => {
        setWeatherLoading(false);
        setWeatherError(true);
        setWeatherErrorMsg('Please turn on location services.');
      }
    );
    // eslint-disable-next-line
  }, []);

  const fetchWeather = async (place, cache = true) => {
    const { lat, lon } = place.coord;
    setPlaceName(place.name);
    setWeatherLoading(true);
    try {
      const data = await fetchCurrentWeather({ lat, lon, cache });
      setRawData(data);
      setWeatherError(false);
      setWeatherErrorMsg('');
      populate(data);
    } catch (error) {
      console.log(error);
      setWeatherLoading(false);
      setWeatherError(true);
      setWeatherErrorMsg('Failed to fetch current weather details.');
    }
  };

  function populate(data) {
    setCurrentUpdate(data.current);
    setHourlyUpdates(data.hourly);
    setDailyUpdates(data.daily);

    setDailyData({
      temp: data.daily[0].temp,
      rain: data.daily[0].pop,
    });

    setSunTimings([
      data.daily[0].sunrise,
      data.daily[0].sunset,
      data.daily[1].sunrise,
      data.daily[1].sunset,
      data.daily[2].sunrise,
      data.daily[2].sunset,
    ]);

    // console.log(data);
    setBGClass(
      DataService.getBackgroundClass(
        data.current.weather[0].icon,
        data.current.weather[0].id
      )
    );
    setWeatherLoading(false);
  }

  useIdleTimer({
    timeout: 1000 * 30,
    onIdle: handleOnIdle,
  });

  return (
    <div
      className={`main-container ${bgClass} ${
        drawerShown ? ' drawer-open' : ''
      }`}
    >
      <div className="left" onClick={(e) => setMinimalView(false)}>
        {weatherLoading ? (
          <div className="loading">Fetching...</div>
        ) : weatherError ? (
          <div className="loading">{weatherErrorMsg}</div>
        ) : (
          rawData && (
            <>
              <CurrentUpdate
                data={currentUpdate}
                dailydata={dailyData}
                timings={sunTimings}
                miniview={minimalView}
                name={placeName}
              />
              {!minimalView && (
                <HourlyUpdates data={hourlyUpdates} timings={sunTimings} />
              )}
              {!minimalView && <Next7Days data={dailyUpdates} />}
              {!minimalView && (
                <div className="footer">
                  Data provided by{' '}
                  <a
                    href="https://openweathermap.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    openweathermap
                  </a>
                </div>
              )}
            </>
          )
        )}
      </div>
      {drawerShown ? (
        <div className="right">
          <Sidebar
            onCloseClicked={() => setDrawerShown(false)}
            onPlaceClicked={(e) => fetchWeather(e, false)}
            klass={bgClass}
          />
        </div>
      ) : (
        !weatherLoading &&
        !weatherError && (
          <div
            className="grabber"
            onClick={(e) => setDrawerShown(!drawerShown)}
          ></div>
        )
      )}
    </div>
  );
};

export default App;
