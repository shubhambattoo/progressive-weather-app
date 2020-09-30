import axios from 'axios';
import DataService from './dataService';
// import data from '../data.json';

const URL = 'https://api.openweathermap.org/data/2.5/onecall';
const SEARCHURL = 'https://api.openweathermap.org/data/2.5/weather';
const API_KEY = 'f33a484cf794d08d0148764789aaba32';

export const fetchWeather = async (query, units = 'metric') => {
  const { data } = await axios.get(SEARCHURL, {
    params: { q: query, units, APPID: API_KEY },
  });
  return data;
};

export const fetchCurrentWeather = async ({
  lat,
  lon,
  cache = true,
  units = 'metric',
}) => {
  if (cache) {
    const cached = DataService.getCachedData();
    if (cached) {
      if (cached.expiry > new Date().getTime()) {
        return cached.data;
      } else {
        const { data } = await axios.get(URL, {
          params: {
            lat,
            lon,
            units,
            exclude: 'minutely',
            APPID: API_KEY,
          },
        });
        DataService.storeDataInCache(data);
        return data;
      }
    } else {
      const { data } = await axios.get(URL, {
        params: {
          lat,
          lon,
          units,
          exclude: 'minutely',
          APPID: API_KEY,
        },
      });
      DataService.storeDataInCache(data);
      return data;
    }
  } else {
    const { data } = await axios.get(URL, {
      params: {
        lat,
        lon,
        units,
        exclude: 'minutely',
        APPID: API_KEY,
      },
    });
    return data;
  }
};
