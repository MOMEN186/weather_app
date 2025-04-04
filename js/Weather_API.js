import CONFIG from '../config.js';

const port = 8080; 
const API_KEY = CONFIG.API_KEY;


const weatherBG = {
    Fog: "../assets/backgrounds/fog.jpeg",
    Clear: "../assets/backgrounds/sunny.jpg",
    Clouds: "../assets/backgrounds/cloudy.jpg",
    Mist: "../assets/backgrounds/fog.jpeg",
    Haze: "../assets/backgrounds/fog.jpeg",
    Default: "../assets/backgrounds/skyview.jpg"
};

const weatherIcon = {
    Fog: "../assets/icons/fog.jpeg",
    Clear: "../assets/icons/sunny.jpg",
    Clouds: "../assets/icons/cloudy.jpg",
    Mist: "../assets/icons/fog.jpeg",
    Haze: "../assets/icons/fog.jpeg",
    Default: "../assets/icons/default.jpg"
};


export async function fetchWeather(city, country) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${API_KEY}&units=metric`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("City not found");

        const data = await response.json();
        console.log("Weather Data:", data);

        addToHistory(data);
        renderWeather(data);

    } catch (error) {
        console.error("Error:", error.message);
        document.getElementsByClassName("temperature")[0].textContent = "City not found.";
    }
}


function debounce(func, delay) {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => func.apply(this, args), delay);
    };
}


function RetrieveHistory() {
    const username = localStorage.getItem("username");
    if (!username) return;

    fetch(`http://localhost:${port}/history/${username}`)
        .then((res) => res.json())
        .then((data) => {
            if (data.success) {
                const historyContainer = document.getElementsByClassName("history-card")[0];
                historyContainer.innerHTML = "";

                data.history.forEach((item) => {
                    renderingHistory(historyContainer, item);
                });
            }
        })
        .catch((error) => console.error("Error fetching history:", error));
}


function renderingHistory(container, item) {
    const div = document.createElement("div");
    div.className = "history-details";

    let html = "";

    // For recent API responses
    if (item.main && item.weather) {
        html = `City Name: ${item.name}<br>Temperature: ${item.main.temp}°C<br>Weather: ${item.weather[0].description}`;
    } 
    // For stored history items
    else {
        const date = item.timestamp ? new Date(item.timestamp).toLocaleString() : "Unknown time";
        html = `City Name: ${item.name || item.query}<br>Searched at: ${date}`;
    }

    div.innerHTML = html;
    container.prepend(div);
}

function renderWeather(data) {
    document.getElementsByClassName("temperature")[0].textContent = `${data.main.temp} °C`;
    document.getElementById("wind").textContent = `${data.wind.speed} m/s`;
    document.getElementById("humidity").textContent = `${data.main.humidity} %`;
    document.getElementById("description").textContent = `${data.weather[0].description}`;
    changeBg(data.weather[0].main);
    changeIcon(data.weather[0].main);
}


function addToHistory(data) {
    const history = JSON.parse(localStorage.getItem("history")) || [];
    history.push(data);
    localStorage.setItem("history", JSON.stringify(history));

    fetch(`http://localhost:${port}/history`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            username: localStorage.getItem("username"),
            search_query: data.name  
        })
    })
    .then((res) => res.json())
    .then((res) => console.log(res))
    .catch((err) => console.error("Error saving history:", err));

    renderingHistory(document.getElementsByClassName("history-card")[0], data);
}


function changeBg(condition) {
    const img = document.getElementsByClassName("bg-img")[0];
    if (img) {
        img.src = weatherBG[condition] || weatherBG["Default"];
    }
}

function changeIcon(condition) {
    const icon = document.getElementById("icon");
    if (icon) {
        icon.src = weatherIcon[condition] || weatherIcon["Default"];
    }
}


function clearHistory() {
    localStorage.removeItem("history");
    const historyContainer = document.getElementsByClassName("history-card")[0];
    historyContainer.innerHTML = "";
}


const debouncedFetchWeather = debounce(fetchWeather, 3000);
document.getElementById("search-area").addEventListener("input", (event) => {
    const input = event.target.value.trim().split(",");
    const city = input[0].trim();
    const country = input[1] ? input[1].trim() : "";
    if (city) debouncedFetchWeather(city, country);
});


RetrieveHistory();
