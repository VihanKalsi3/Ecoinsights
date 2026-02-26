// Function to fetch the current AQI from the AirVisual API
async function fetchAQIData(selectedLocation) {
    let astate = "Delhi";
    let country="India";
    if (selectedLocation === "Gurugram") {
        astate = "Haryana";
        country = "India";
    } else if (selectedLocation === "Noida") {
        astate = "Uttar Pradesh";
        country = "India";
    }else if (selectedLocation === "Huangshi") {
         astate = "Hubei";
         country = "China";
    }else if (selectedLocation === "San Jose") {
          astate = "California";
          country = "USA";
    }
/*
    console.log("construct url");
    const apiKey = 'aabd07d8-ec4d-40e5-b346-b4094af6ad05'; // Replace with your AirVisual API key
    const apiUrl = `https://api.airvisual.com/v2/city?city=${selectedLocation}&state=${astate}&country=${country}&key=${apiKey}`;
    console.log(apiUrl);
*/
const responseData = `https://api.openweathermap.org/geo/1.0/direct?q=${selectedLocation}&limit=1&appid=6e945e7799f5f9c31b02c91bd15c0446`;
        const response = await fetch(responseData);
        console.log(responseData);
        const data = await response.json();
        let latitude;
        let longitude;
        if(selectedLocation != "Current Location"){
                console.log("Not current location");
                latitude = data[0].lat;
                longitude = data[0].lon;
        } else{
            console.log("This is current location");
            const currentLocation = await getCurrentLocation();
            latitude = currentLocation.latitude;
            longitude = currentLocation.longitude;
        }

        console.log(latitude + "lat");
        console.log(longitude + "lon");

        const requestUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${latitude}&lon=${longitude}&appid=6e945e7799f5f9c31b02c91bd15c0446`;

        console.log(requestUrl);
        console.log("Fetching air pollution data...");

        const responseOnPol = await fetch(requestUrl);

        console.log("got data");

        if (responseOnPol.ok) {
            console.log("Data fetched successfully");
            const dataOnPol = await responseOnPol.json();
            console.log("Air pollution data:", dataOnPol);
            return dataOnPol.list[0].main.aqi;
        } else {
            throw new Error('Failed to fetch data');
        }
/*
    try {
        const response = await fetch(apiUrl);

        if (response.ok) {
            const responseData = await response.json();
            console.log(responseData);

            // Alternatively, you can use a specific key to log a specific part of the data
            console.log(responseData.data.current.pollution.aqius);

            return responseData.data.current.pollution.aqius; // AQI value
        } else {
            throw new Error('Failed to fetch AQI data');
        }
    } catch (error) {
        console.error('Error fetching data:', error.message);
        return 'N/A';
    }
*/
}

// Function to update the AQI display and color-coded indicator
async function updateAQIDisplay() {
    const locationSelect = document.getElementById('locationSelect');
    const aqiDisplayElement = document.getElementById('aqiDisplay');
    const aqiIndicatorElement = document.getElementById('aqiIndicator');
    const selectedLocation = locationSelect.value;
    console.log("fetch AQI data from:" + selectedLocation);

    //store selectedLocation -- to get longitude/lattitude in next page
    localStorage.setItem('locationData', JSON.stringify(selectedLocation));
    //window.loc = JSON.stringify(selectedLocation);
    //console.log("local storage:"+localStorage.getItem('locationData'));
    // Fetch AQI data for the selected location
    const aqiValue = await fetchAQIData(selectedLocation);
    console.log("got AQI data");

    // Set AQI display text
    aqiDisplayElement.textContent = `Current AQI level in ${selectedLocation}: ${aqiValue}`;
    console.log("display AQI data");

    // Set color-coded indicator
    if (aqiValue < 3) {
        // Good (Green)
        aqiIndicatorElement.style.backgroundColor = '#00e400';
    } else if (aqiValue == 3) {
        // Moderate (Yellow)
        aqiIndicatorElement.style.backgroundColor = '#ffff00';
    } else {
        // Unhealthy (Red)
        aqiIndicatorElement.style.backgroundColor = '#ff0000';
    }

}

// Update the AQI display and indicator on page load
updateAQIDisplay();

// Set up an event listener to update the AQI display and indicator when the location is changed
document.getElementById('locationSelect').addEventListener('change', updateAQIDisplay);

// Set up an interval to update the AQI display and indicator every 5 minutes (300,000 milliseconds)
setInterval(updateAQIDisplay, 3600000);

// script.js
// enter the second page


// Function to get the user's current location

function getCurrentLocation() {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          resolve({ latitude, longitude });
        },
        (error) => {
          reject(error);
        }
      );
    } else {
      reject(new Error('Geolocation is not supported by this browser.'));
    }
  });
}




function navigateToPage2() {
    window.location.href = 'nextPage.html';
}