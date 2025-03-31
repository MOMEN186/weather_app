import predefinedCities from "./cities.js";
import {fetchWeather} from "./Weather_API.js";
function populateDropdown() {
    console.log(predefinedCities)
    const list = document.getElementById("drop-down");
    list.addEventListener("change", handleChange);

    // just a placeholder option to prevent treating first element as default
    const placeholder = document.createElement("option");
    placeholder.textContent = "Select a city";
    placeholder.disabled = true;
    placeholder.selected = true;
    list.appendChild(placeholder);
    
    
    predefinedCities.forEach(city => {
        const option = document.createElement("option");
        option.value = `${city.city},${city.country}`;
        option.textContent = `${city.city}, ${city.country}`;
       
        list.appendChild(option);
    });
    
}

async function handleChange(e) {
    const input = e.target.value.trim().split(",");    
    console.log(input)
   await fetchWeather(input[0], input[1]);
}


populateDropdown();