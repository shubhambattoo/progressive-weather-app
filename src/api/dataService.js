function getDateTime(unixTimestamp, need, full = false, military = false) {
  let output = '';
  const date = new Date(unixTimestamp * 1000);

  const m = new Date(date).toLocaleString('en-US', { month: 'short' });
  const formattedDate = full
    ? `${m} ${new Date(date).getDate()}, ${new Date(date).getFullYear()}`
    : `${m} ${new Date(date).getDate()}`;

  const hours = date.getHours();
  const minutes = '0' + date.getMinutes();
  const seconds = '0' + date.getSeconds();

  let formattedTime;

  if (!military) {
    let hr = hours;
    const suffix = hours >= 12 ? 'pm' : 'am';
    if (hours === 0) hr = 12;
    if (hours > 12) hr = hours - 12;

    formattedTime = full
      ? `${hr}:${minutes.substr(-2)}:${seconds.substr(-2)} ${suffix}`
      : `${hr}:${minutes.substr(-2)} ${suffix}`;
  } else {
    formattedTime = full
      ? `${hours}:${minutes.substr(-2)}:${seconds.substr(-2)}`
      : `${hours}:${minutes.substr(-2)}`;
  }

  if (need === 'date') {
    output = formattedDate;
  } else if (need === 'time') {
    output = formattedTime;
  } else {
    output = {
      date: formattedDate,
      time: formattedTime,
    };
  }
  return output;
}

function getWeekDay(unixTimestamp, short = false) {
  const date = new Date(unixTimestamp * 1000);
  return new Date(date).toLocaleString('en-US', {
    weekday: short ? 'short' : 'long',
  });
}

function getCardinalDirection(angle) {
  if (typeof angle === 'string') angle = parseInt(angle);
  if (angle <= 0 || angle > 360 || typeof angle === 'undefined') return '☈';
  const arrows = {
    north: '↑ N',
    north_east: '↗ NE',
    east: '→ E',
    south_east: '↘ SE',
    south: '↓ S',
    south_west: '↙ SW',
    west: '← W',
    north_west: '↖ NW',
  };
  const directions = Object.keys(arrows);
  const degree = 360 / directions.length;
  angle = angle + degree / 2;
  for (let i = 0; i < directions.length; i++) {
    if (angle >= i * degree && angle < (i + 1) * degree)
      return arrows[directions[i]];
  }
  return arrows['north'];
}

function getBackgroundClass(icon, id) {
  let klass = '';
  switch (icon) {
    case '01d':
    case '01n':
      klass = 'clear-sky';
      break;
    case '02d':
    case '02n':
      klass = 'few-clouds';
      break;
    case '03d':
    case '03n':
      klass = 'scattered-clouds';
      break;
    case '04d':
    case '04n':
      klass = 'broken-clouds';
      break;
    case '09d':
    case '09n':
      klass = 'showering-rain';
      break;
    case '10d':
    case '10n':
      klass = 'heavy-rain';
      break;
    case '11d':
    case '11n':
      klass = 'thunderstorm';
      break;
    case '13d':
    case '13n':
      klass = 'snowfall';
      break;
    case '50d':
    case '50n':
      if (id === 711) {
        klass = 'smoke';
      } else if (id === 741) {
        klass = 'fog';
      } else if (id === 781) {
        klass = 'tornado';
      } else {
        klass = 'mist';
      }
      break;
    default:
      break;
  }
  if (icon.slice(-1) === 'n') {
    klass += ' night';
  }
  return klass;
}

function storeDataInCache(data) {
  const dataObj = {
    data,
    expiry: new Date().getTime() + 3600 * 1000,
  };
  const cached = localStorage.setItem(
    'WEATHER_CACHED',
    JSON.stringify(dataObj)
  );
  return cached ? JSON.parse(cached) : null;
}

function getCachedData() {
  const cached = localStorage.getItem('WEATHER_CACHED');
  return cached ? JSON.parse(cached) : null;
}

const DataService = {
  getDateTime,
  getWeekDay,
  getCardinalDirection,
  getBackgroundClass,
  getCachedData,
  storeDataInCache,
};

export default DataService;
