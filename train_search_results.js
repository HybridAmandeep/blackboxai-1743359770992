// Get query parameters from URL
const urlParams = new URLSearchParams(window.location.search);
const fromStation = urlParams.get('from');
const toStation = urlParams.get('to');
const journeyDate = urlParams.get('date');

// Display search criteria
document.getElementById('fromStationDisplay').textContent = getStationName(fromStation);
document.getElementById('toStationDisplay').textContent = getStationName(toStation);
document.getElementById('journeyDateDisplay').textContent = formatDate(journeyDate);

// Fetch trains from API
async function fetchTrains() {
    try {
        const response = await fetch(`http://localhost:3000/api/trains?from=${fromStation}&to=${toStation}`);
        if (!response.ok) throw new Error('Failed to fetch trains');
        return await response.json();
    } catch (error) {
        console.error('Error fetching trains:', error);
        alert('Error loading train data. Please try again.');
        return [];
    }
}

// Populate trains table
async function populateTrains() {
    const trainsList = document.getElementById('trainsList');
    trainsList.innerHTML = '<tr><td colspan="7" class="py-8 text-center">Loading trains...</td></tr>';
    
    const trains = await fetchTrains();
    
    if (trains.length === 0) {
        trainsList.innerHTML = '<tr><td colspan="7" class="py-8 text-center">No trains found for this route</td></tr>';
        return;
    }

    trainsList.innerHTML = '';
    
    trains.forEach(train => {
        const row = document.createElement('tr');
        row.className = 'hover:bg-gray-50';
        
        row.innerHTML = `
            <td class="py-4 px-4">${train.Train_code}</td>
            <td class="py-4 px-4">
                <div class="font-semibold">${train.Train_name}</div>
                <div class="text-sm text-gray-500">${getStationName(train.Start_station_code)} to ${getStationName(train.End_station_code)}</div>
            </td>
            <td class="py-4 px-4">
                <div class="font-semibold">${train.Start_time}</div>
                <div class="text-sm text-gray-500">${getStationName(train.Start_station_code)}</div>
            </td>
            <td class="py-4 px-4">
                <div class="font-semibold">${train.End_time}</div>
                <div class="text-sm text-gray-500">${getStationName(train.End_station_code)}</div>
            </td>
            <td class="py-4 px-4">${calculateDuration(train.Start_time, train.End_time)}</td>
            <td class="py-4 px-4">
                <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                    1A (₹3500)
                </span>
                <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                    2A (₹2500)
                </span>
            </td>
            <td class="py-4 px-4">
                <button onclick="bookTrain('${train.Train_code}')" class="bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition duration-300">
                    Book Now
                </button>
            </td>
        `;
        
        trainsList.appendChild(row);
    });
}

// Helper functions
function getStationName(stationCode) {
    const stations = {
        'DEL': 'Delhi', 'MUM': 'Mumbai', 'CHE': 'Chennai',
        'BAN': 'Bangalore', 'GWL': 'Gwalior', 'BPL': 'Bhopal'
    };
    return stations[stationCode] || stationCode;
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

function calculateDuration(start, end) {
    // Simple duration calculation - would be improved in production
    return "14h 0m"; 
}

function bookTrain(trainCode) {
    localStorage.setItem('selectedTrainCode', trainCode);
    window.location.href = `seat_selection.html?train=${trainCode}`;
}

// Initialize
document.addEventListener('DOMContentLoaded', populateTrains);