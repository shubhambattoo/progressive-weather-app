import { useState } from 'react';
import { fetchWeather } from '../api/fetchWeather';
import './Sidebar.css';

const Sidebar = ({ klass, onPlaceClicked, onCloseClicked }) => {
  const [tempUnit] = useState('°c'); //  F
  const [query, setQuery] = useState('');
  const [weather, setWeather] = useState(null);
  const [searching, setSearching] = useState(false);
  const [searchCompleted, setSearchCompleted] = useState(false);

  function inputChange(e) {
    setQuery(e.target.value);
  }

  const search = async (e) => {
    if (e.key === 'Enter') {
      setSearching(true);
      try {
        const data = await fetchWeather(query);
        setSearchCompleted(true);
        setSearching(false);
        setWeather(data);
        setQuery('');
      } catch (error) {
        setSearchCompleted(true);
        setWeather(null);
        setSearching(false);
      }
    }
  };

  const selectPlace = (e) => {
    onCloseClicked(true);
    onPlaceClicked(e);
  };

  return (
    <>
      <div className={`glass ${klass}`}></div>
      <div
        className={`glass-contents ${klass.includes('night') ? 'night' : ''}`}
      >
        <div className="close" onClick={(e) => onCloseClicked(true)}>
          &times;
        </div>
        <div className="searchbox">
          <input
            type="text"
            name="name"
            id="name"
            className="search"
            placeholder="Search place..."
            value={query}
            onChange={inputChange}
            onKeyPress={search}
            autoComplete="off"
          />
        </div>
        {searching && <div className="searching">Searching...</div>}
        {searchCompleted && (
          <div className="locations">
            {weather ? (
              <>
                <div className="results">
                  <div
                    className="place big"
                    onClick={(e) => selectPlace(weather)}
                  >
                    <div className="place-info">
                      <p>
                        {weather.name}, {weather.sys.country}
                      </p>
                      <span>Currently {weather.weather[0].description}</span>
                    </div>
                    <div className="condition">
                      <div className="w">
                        <div className="temp">
                          {Math.round(weather.main.temp)} {tempUnit}
                        </div>
                        <div className="icon">
                          <img
                            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
                            alt={weather.weather[0].description}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* <div className="place">Set as default</div> */}
              </>
            ) : (
              !searching && <div className="noplace">No result found</div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Sidebar;
