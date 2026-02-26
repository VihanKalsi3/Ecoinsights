document.addEventListener('DOMContentLoaded', async function () {

    try {
        storedData = localStorage.getItem('locationData');

        if (storedData) {
            selectedLocation = JSON.parse(storedData);
            console.log('Selected Location:', selectedLocation);
        } else {
            console.error('No location data found');
        }
    } catch (error) {
        console.error('Error parsing location data:', error.message);
    }

});

//const API_KEY2 = '6e945e7799f5f9c31b02c91bd15c0446';
//const API_URL2 = 'https://api.openweathermap.org/data/2.5/air_pollution';

async function fetchDataAndUpdateHtml() {
    try {
        const responseData = `https://api.openweathermap.org/geo/1.0/direct?q=${selectedLocation}&limit=1&appid=6e945e7799f5f9c31b02c91bd15c0446`;
        const response = await fetch(responseData);
        console.log(responseData);
        const data = await response.json();
        const latitude = data[0].lat;
        const longitude = data[0].lon;

        console.log(latitude + "lat");
        console.log(longitude + "lon");

        const requestUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${latitude}&lon=${longitude}&appid=6e945e7799f5f9c31b02c91bd15c0446`;

        console.log("Fetching air pollution data...");

        const responseOnPol = await fetch(requestUrl);

        console.log("got data");

        if (responseOnPol.ok) {
            console.log("Data fetched successfully");
            const dataOnPol = await responseOnPol.json();
            console.log("Air pollution data:", dataOnPol);
            updateHtmlWithData(dataOnPol);
            return data;
        } else {
            throw new Error('Failed to fetch data');
        }
    } catch (error) {
        console.error('Error fetching data:', error.message);
        return 'N/A';
    }
}

async function updateHtmlWithData(data) {
    try {
        console.log("Updating HTML with air pollution data");
        const airPollutionDataElement = document.getElementById('airPollutionData');

        if (!data || !data.list || data.list.length === 0) {
            console.error("Invalid data format");
            return;
        }

        const pollutionInfo = data.list[0];
        const timeOfCalculation = new Date(pollutionInfo.dt * 1000);
        const coLevel = pollutionInfo.components.co;
        const no2Level = pollutionInfo.components.no2;
        const o3Level = pollutionInfo.components.o3;
        const so2Level = pollutionInfo.components.so2;
        const nh3Level = pollutionInfo.components.nh3;
        const pm10Level = pollutionInfo.components.pm10;
        const pm25Level = pollutionInfo.components.pm2_5;

        const htmlContent = `
            <h1>Fetching particle data for ${selectedLocation}</h1>
            <p>Time of Calculation: ${timeOfCalculation}</p>
            <p>Carbon Monoxide (CO): ${coLevel}</p>
            <p>Nitrogen Dioxide (NO2): ${no2Level}</p>
            <p>Ozone (03): ${o3Level}</p>
            <p>Sulphur Dioxide (02): ${so2Level}</p>
            <p>Ammonia (NH3): ${nh3Level}</p>
            <p>Particulate Matter (PM10): ${pm10Level}</p>
            <p>Particulate Matter (PM2.5): ${pm25Level}</p>
            <p></p>
            <p> Reference: o3Level > 40 && no2Level >150 && pm10Level >100 && pm25Level >50 && CO>12400 : Unhealthy </p>
            <p> Reference: Color Red is a high alert level </p>
            <!-- Add more data fields as needed -->
        `;

        airPollutionDataElement.innerHTML = htmlContent;

        // Set color-coded indicator based on AQI and ozone levels
        const aqiIndicatorElement = document.getElementById('aqiIndicator');
        const aqiValue = calculateAQI(o3Level); // You need to implement a function to calculate AQI from ozone level

        if (aqiValue <= 50 && o3Level < 70 && no2Level <70 && pm10Level <50 && pm25Level <25 && coLevel<9400) {
            // Good (Green)
            aqiIndicatorElement.style.backgroundColor = '#00e400';
            consol.log("green");
        } else if (aqiValue <= 100 && o3Level <= 140 && no2Level <=150 && pm10Level <=100 && pm25Level <=50 && coLevel<=12400) {
            // Moderate (Yellow)
            aqiIndicatorElement.style.backgroundColor = '#ffff00';
            console.log("yellow");
        } else {
            // Unhealthy (Red)
            aqiIndicatorElement.style.backgroundColor = '#ff0000';
            console.log("red");
        }
    } catch (error) {
        console.error("Error updating HTML:", error);
    }
}

function calculateAQI(o3Level) {
    // Implement the logic to calculate AQI based on ozone level
    // You can use the same logic you have for AQI calculation
    // or use a library/function to calculate AQI
    // Return the calculated AQI value
    return 1;
}

document.addEventListener('DOMContentLoaded', fetchDataAndUpdateHtml);

// ... (Your existing functions)

// Set up an event listener for the pollutant dropdown
document.getElementById('pollutantSelect').addEventListener('change', updateImpactInformation);




async function updateImpactInformation() {
    try {
        console.log('updating impact information');
        var selectedPollutant = document.getElementById('pollutantSelect').value;

        // Fetch impact information based on the selected pollutant
        var impactData = await fetchImpactData(selectedPollutant);
        console.log(impactData.impactData);
        // Update HTML with impact information
        updateImpactHtml(selectedPollutant, impactData.impactData);

    } catch (error) {
        console.error('Error updating impact information:', error.message);
    }
}

async function fetchImpactData(pollutant) {
    // Implement the logic to fetch impact data based on the selected pollutant
    // You may fetch this data from an API or use predefined values
    // Return the impact data
    console.log('fetch impact data');
    var impactData = { impactData: "" }; // Initialize the impactData object
    try {
        if (pollutant === "co") {
            impactData.impactData = "";
            console.log("blank");
        } else if (pollutant === "no2") {
            impactData.impactData = "Decrease plant growth and yields";
            console.log("Decrease plant growth and yields");
        } else if (pollutant === "o3") {
            impactData.impactData = "Increase in vulnerability to disease, pests, cold and drought";
            console.log("Increase in vulnerability to disease, pests, cold and drought");
        } else if (pollutant === "nh3") {
            impactData.impactData = "";
            console.log("blank");
        } else if (pollutant === "pm10"){
            impactData.impactData = "Alters Plant Growth and yield";
            console.log("Alters Plant Growth and yield");
        } else if( pollutant === "pm25") {
            impactData.impactData = "Alters Plant Growth and yield";
            console.log("Alters Plant Growth and yield");
        }
        console.log("here is the impactData:");
        console.log(impactData.impactData);
    } catch (error) {
        console.error("Encountered error:", error.message);
    }
    return impactData;
}




function updateImpactHtml(selectedPollutant, impact ) {
    console.log('Impact Data');
    console.log(selectedPollutant);
    console.log(impact );
    try {
        const impactContainer = document.getElementById('impactContainer');

        // Display impact information based on the selected pollutant
        const impactContent = `
            <p>Impact of ${selectedPollutant} on Crops and Plants</p>
            <p>${impact}</p>
            <!-- Add more impact details as needed -->
        `;

        impactContainer.innerHTML = impactContent;

    } catch (error) {
        console.error('Error updating impact HTML:', error.message);
    }
}