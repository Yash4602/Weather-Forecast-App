const apiKey = '95c7f68ca509d1ad72c015c19e0d9feb'; // CHANGE HERE: Add your actual API key

// Fetch current weather by city name
async function fetchCurrentWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`; // CHANGE HERE: API URL for current weather
  return fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`); // CHANGE HERE: Error handling
      }
      return response.json();
    })
    .catch(error => console.error('Error fetching current weather:', error)); // CHANGE HERE: Error handling
}

// Fetch 5-day forecast by city name
async function fetchForecast(city) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`; // CHANGE HERE: API URL for 5-day forecast
  return fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`); // CHANGE HERE: Error handling
      }
      return response.json();
    })
    .catch(error => console.error('Error fetching forecast:', error)); // CHANGE HERE: Error handling
}

// Map weather to animation and icon
function getWeatherIcon(condition) {
  if (condition.includes('rain')) {
    return { icon: '🌧️', animation: 'rain-animation' }; // CHANGE HERE: Modify icon and animation as needed
  } else if (condition.includes('clear')) {
    return { icon: '☀️', animation: 'sun-animation' }; // CHANGE HERE: Modify icon and animation as needed
  } else if (condition.includes('cloud')) {
    return { icon: '☁️', animation: 'cloud-animation' }; // CHANGE HERE: Modify icon and animation as needed
  } else if (condition.includes('snow')) {
    return { icon: '❄️', animation: 'snow-animation' }; // CHANGE HERE: Modify icon and animation as needed
  }
  return { icon: '🌫️', animation: 'default-animation' }; // CHANGE HERE: Default icon and animation
}

// Update current weather card
function updateCurrentWeather(data) {
  const cityName = document.getElementById('cityName');
  const currentDate = document.getElementById('currentDate');
  const temperature = document.getElementById('temperature');
  const wind = document.getElementById('wind');
  const humidity = document.getElementById('humidity');
  const description = document.getElementById('description');
  const currentIcon = document.getElementById('currentIcon');

  const condition = data.weather[0].main.toLowerCase();
  const { icon } = getWeatherIcon(condition);

  cityName.textContent = `${data.name}`;
  currentDate.textContent = `${new Date().toLocaleDateString()}`;
  temperature.textContent = `Temperature: ${data.main.temp}°C`;
  wind.textContent = `Wind: ${data.wind.speed} M/S`;
  humidity.textContent = `Humidity: ${data.main.humidity}%`;
  description.textContent = `${data.weather[0].description}`;
  currentIcon.innerHTML = `<span style="font-size:50px;">${icon}</span>`;
}

// Update 5-day forecast cards
function updateForecast(data) {
  const forecastContainer = document.getElementById('forecastCards');
  forecastContainer.innerHTML = '';

  const filteredData = data.list.filter(item => item.dt_txt.includes('12:00:00')); // Only take data for 12:00 PM
  filteredData.forEach(day => {
    const card = document.createElement('div');
    card.className = 'forecast-card';
    const condition = day.weather[0].main.toLowerCase();
    const { icon } = getWeatherIcon(condition);

    card.innerHTML = `
      <p>${day.dt_txt.split(' ')[0]}</p>
      <p>${icon}</p>
      <p>Temp: ${day.main.temp}°C</p>
      <p>Wind: ${day.wind.speed} M/S</p>
      <p>Humidity: ${day.main.humidity}%</p>
    `;
    forecastContainer.appendChild(card);
  });
}

// Search button event listener
document.getElementById('searchBtn').addEventListener('click', async () => {
  const city = document.getElementById('cityInput').value;
  if (!city) return alert('Please enter a city name');
  const currentWeatherData = await fetchCurrentWeather(city);
  const forecastData = await fetchForecast(city);

  updateCurrentWeather(currentWeatherData);
  updateForecast(forecastData);
});

// Location button event listener
document.getElementById('locationBtn').addEventListener('click', () => {
  navigator.geolocation.getCurrentPosition(async position => {
    const { latitude, longitude } = position.coords;
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`; // CHANGE HERE: API URL for location-based weather
    const currentWeatherData = await fetch(url)
      .then(res => res.json())
      .catch(error => console.error('Error fetching location weather:', error)); // CHANGE HERE: Error handling
    const forecastData = await fetchForecast(currentWeatherData.name);

    updateCurrentWeather(currentWeatherData);
    updateForecast(forecastData);
  });
});
