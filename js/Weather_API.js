import CONFIG from "./config.js";
const API_KEY = CONFIG.API_KEY;
const weatherBG = {
  Fog: "../assets/backgrounds/fog.jpeg",
  Clear: "../assets/backgrounds/sunny.jpg",
  Clouds: "../assets/backgrounds/cloudy.jpg",
  Mist: "../assets/backgrounds/fog.jpeg",
  Haze: "../assets/backgrounds/fog.jpeg",
};
const weatherIcon = {
    Fog: "fa-solid fa-smog",
    Clear: "fa-solid fa-sun",
    Clouds: "fa-solid fa-cloud",
    Mist: "fa-solid fa-smog",
    Haze: "fa-solid fa-smog",
    Rain: "fa-solid fa-cloud-rain",
    Wind:"fa-solid fa-wind"
}
export async function fetchWeather(city, country) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${API_KEY}&units=metric`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("City not found");

    const data = await response.json();
    console.log("Weather Data:", data);

    // Display Data on Screen
    addToHistory(data);
    renderWeather(data);
  } catch (error) {
    console.error("Error:", error.message);
    document.getElementsByClassName("temperature")[0].textContent =
      error.message;
  }
}

function debounce(func, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer); // Reset timer if user types again
    timer = setTimeout(() => func.apply(this, args), delay);
  };
}

function RetrieveHistory() {
  const history = JSON.parse(localStorage.getItem("history")) || [];
  const historyContainer = document.getElementsByClassName("history-card")[0];
  historyContainer.innerHTML = ""; // Clear previous history in dom
  console.log(historyContainer);
  console.log(history);

  history.forEach((item) => {
    renderingHistory(historyContainer, item); // histoy
  });
  // console.log(historyContainer);
}

function renderingHistory(historyContainer, item) {
  const listItem = document.createElement("div");
  listItem.className = "history-details";
  listItem.innerHTML = `City Name : ${item.name} Temperature : ${item.main.temp}°C Weather Description :  ${item.weather[0].description}`;
  historyContainer.prepend(listItem);
}

function renderWeather(data) {
  document.getElementsByClassName(
    "temperature"
  )[0].textContent = ` ${data.main.temp} °C `;
  document.getElementById("wind").textContent = ` ${data.wind.speed} m/s `;
  document.getElementById("humidity").textContent = ` ${data.main.humidity} % `;
  document.getElementById(
    "description"
  ).textContent = ` ${data.weather[0].description}  `;
}

function addToHistory(weatherData) {
    console.log(weatherData)
    const history = JSON.parse(localStorage.getItem("history")) || [];
    history.push(weatherData);
    localStorage.setItem("history", JSON.stringify(history));
    renderingHistory(document.getElementsByClassName("history-card")[0], weatherData);
    changeBg(weatherData.weather[0].main);
    changeIcon(weatherData.weather[0].main);
}
function changeBg(condition) {
    const img = document.getElementsByClassName("bg-img")[0];
    img.src = weatherBG[condition]? weatherBG[condition]:"../assets/backgrounds/skyview.jpg";
}

function changeIcon(condition) {
    console.log(condition);
    const icon = document.getElementById("icon");
    icon.className = weatherIcon[condition];
    
}

function clearHistory() {
  localStorage.removeItem("history");
  const historyContainer = document.getElementsByClassName("history-card")[0];
  historyContainer.innerHTML = ""; // Clear previous history
  console.log(historyContainer);
}

const debouncedFetchWeather = debounce(fetchWeather, 3000); // 3s delay

document.getElementById("search-area").addEventListener("input", (event) => {
  const input = event.target.value.trim().split(",");
  console.log(input);
  if (input.length < 2) {
    const city = input[0].trim();
    debouncedFetchWeather(city, "");
  } else {
    const city = input[0].trim();
    const country = input[1].trim();
    debouncedFetchWeather(city, country);
  }
});
RetrieveHistory(); // Call this function to display history on page load