const STARTING_CREDITS = 1000
var stations = []; // I apologize deeply for the sin I have comitted.
let maxStations = 5;
let stationsBought = 0;
let credits = 0 //DO NOT MODIFY
let stationPrice = 1000;
let capacityPrice = 15000;

let ertSquadrons = 3;
let dsSquadrons = 0;

/**
 * Adds an integer amount of credits
 * @param {number} credits_added
 */
function addCredits(credits_added) {
	credits += credits_added;
	document.getElementById("credits").textContent = `${credits.toLocaleString()}`;
	if (credits > 0) {
		document.getElementById("credits").style.color = "#00aa00"
	} else if (credits < 0) {
		document.getElementById("credits").style.color = "#ff0000"
	} else {
		document.getElementById("credits").style.color = "#000000"
	}
}

/**
 * Allows you to buy more station capacity for `capacityPrice` amount of credits.
 */
function buyStationCapacity() {
	if (credits >= capacityPrice) {
		addEventLog(loc.formatString("%events.buyStationCapacity", [capacityPrice]), dummyStation, "#00aa00")
		addCredits(-capacityPrice)
		maxStations++;
		capacityPrice = Math.floor(capacityPrice *= 1.5);
		document.getElementById("stationsAmount").innerHTML = `${stationsBought}/${maxStations}`
		document.getElementById("capacityPrice").innerHTML = `(${capacityPrice})`
	}
}

let dummyStation;

function massBuyInvestment() {
	let failedStations = 0;
	let totalPrice = 0;
	stations.forEach(station => {
		const price = station.investmentPrice;
		if (credits > price) {
			station.investStation();
			totalPrice += price;
		} else {
			failedStations++;
		}
	});
	if (failedStations <= 0) {
		addEventLog(loc.formatString("%events.massBuyInvestment", [totalPrice]), dummyStation, "#00aa00")
	} else {
		addEventLog(loc.formatString("%events.massBuyInvestmentALOF", [totalPrice, failedStations]), dummyStation, "#00aa00")
	}
}

function massBuyCrew() {
	let failedStations = 0;
	let totalPrice = 0;
	stations.forEach(station => {
		const price = station.crewmemberPrice * 5
		console.log(station);
		if (credits > price) {
			station.buyCrew(5);
			totalPrice += price;
		} else {
			failedStations++;
		}
	});
	if (failedStations <= 0) {
		addEventLog(loc.formatString("%events.massBuyCrew", [totalPrice]), dummyStation, "#00aa00")
	} else {
		addEventLog(loc.formatString("%events.massBuyCrewALOF", [totalPrice, failedStations]), dummyStation, "#00aa00")
	}
}

/**
 * Concentrates all the data in memory, into a base64 string
 * @returns base64 string
 */
function exportData() {
	const fullData = {
		stationAmount: 0,
		stationPrice: 0,
		capacityPrice: 0,
		maxStations: 0,
		tickNumber: 0,
		credits: 0,
		threat: 20,
		stations: []
	}
	for (let i = 0; i < stations.length; i++) {
		const data = stations[i];
		fullData.stations.push(data);
	}

	fullData.stationAmount = stationsBought;
	fullData.stationPrice = stationPrice;
	fullData.capacityPrice = capacityPrice;
	fullData.tickNumber = tickNumber;
	fullData.credits = credits;
	fullData.maxStations = maxStations;
	fullData.threat = threatLevel;

	return btoa(JSON.stringify(fullData));
}

/**
 * Imports data from a `base64 string` to memory, returns 0 if succeeded, returns 1 if else.
 * @param {base64 string} data
 */
function importData(data) {
	try {
		const packedData = JSON.parse(atob(data));
		console.log(packedData)

		// Actually clear stations.
		while(stations.length > 0) {
			stations.pop();
		}

		for (let i = 0; i < packedData.stations.length; i++) {
			const station = packedData.stations[i];
			addStation(new Station(
				station.name,
				station.crew || 5,
				station.rawRevenue,
				station.unrest,
				station.createdOn,
				station.upgrades,
				station.offsetPPC,
				station.booleans.revolution,
				false,
				false,
				station.booleans.missing || false,
				0
			), false, false);
		}

		stationsBought = packedData.stationAmount
		stationPrice = packedData.stationPrice
		capacityPrice = packedData.capacityPrice
		tickNumber = packedData.tickNumber
		credits = packedData.credits
		threatLevel = packedData.threat
		maxStations = packedData.maxStations

		document.getElementById("stationsAmount").innerHTML = `${stationsBought}/${maxStations}`
		document.getElementById("capacityPrice").innerHTML = `(${capacityPrice})`
		document.getElementById("buyStation").innerHTML = `Buy Station (${stationPrice})`
		document.getElementById("stationsAmount").innerHTML = `${stationsBought}/${maxStations}`
		return 0;
	} catch (e) {
		console.error(e);
		return 1;
	}
}

/**
 * Returns the station index (stations[index]).
 * @param {Number} tickN
 * @returns station index, else -1
 */
function getStationByTick(tickN) {
	return stations.findIndex(station => station.createdOn == tickN);
}

/**
 * Adds a station to `stations` and adds the corrensponding HTML div
 * @param {Station} station
 * @param {boolean} sound
 * @param {boolean} disableButton
 */
function addStation(station, sound=true, disableButton=true) {
	stations.push(station);
	const div = document.createElement("div")
	div.classList.add('station');
	div.innerHTML = `
	<h2 class="station_name">${station.name}</h2>
	<span class="station_revenue"></span>|
	<span class="station_unrest"></span>|
	<span class="station_uptime"></span>|
	<span class="station_crew"></span><br>
	<span class="station_details"></span><br>
	<span class="station_overtaken" style="color: #a00"><strong>In revolutionary hands</strong></span>
	<span class="station_missing" style="color: #a00"><strong>Disconnected from NT comm-link</strong></span>

	<!-- holy shit button hell -->
	<h3>Control Panel</h3>
	<details>
		<summary>Station Controls</summary>
		<button onclick="stations[getStationByTick('${station.createdOn}')].sellStation()" class="station_sell">Sell Station</button>
		<button onclick="stations[getStationByTick('${station.createdOn}')].investStation()" class="station_invest">Invest in station</button>
		<button onclick="stations[getStationByTick('${station.createdOn}')].sendDeathsquad()" class="station_ds">Dispatch deathsquad</button>
		<button onclick="stations[getStationByTick('${station.createdOn}')].sendErt()" class="station_ert">Dispatch ERT</button>
		<button onclick="let station = stations[getStationByTick('${station.createdOn}')].payDemands()" class="station_demands">Pay demands</button>

		<!--

		shenanigans
		<button onclick="stations[getStationByTick('${station.createdOn}')]" class="station_dsOrder">Cancel Order</button><br>
		-->
		</details>
	<details>
		<summary>Crew Management</summary>
		<button onclick="stations[getStationByTick('${station.createdOn}')].buyCrew(1)" class="station_crewadd">+</button> Crew (${station.crewmemberPrice}C)
		<button onclick="stations[getStationByTick('${station.createdOn}')].addCrew(-1)" class="station_crewremove">-</button><br>

		<button onclick="stations[getStationByTick('${station.createdOn}')].offsetPPC+= 10;" class="station_adddPPC">++</button>
		<button onclick="stations[getStationByTick('${station.createdOn}')].offsetPPC++;" class="station_addPPC">+</button>
		<span class="station_ppc">CPPC: 0 | DPPC: 0</span>
		<button onclick="stations[getStationByTick('${station.createdOn}')].offsetPPC--;" class="station_remPPC">-</button>
		<button onclick="stations[getStationByTick('${station.createdOn}')].offsetPPC-= 10;" class="station_remmPPC">--</button>
	</details>
	`
	// Add emergency shuttle status WYCI

	// <p class="station_shuttle">Emergency Shuttle Status: ${station.shuttleStatus}</p>
	document.getElementById("stations").appendChild(div)
	div.id = station.createdOn

	if (disableButton) {
		document.getElementById("buyStation").disabled = true
		setTimeout(function(){
			document.getElementById("buyStation").disabled = false
		}, 5000)
	}
	if (sound) {
		try { welcome.play(); } catch {}
	}
}

/**
 * Generates a random station name: Prefix Name Suffix Number
 * @returns string
 */
function generateStationName() {
	const prefix = STATION_PREFIXES[
		Math.floor(Math.random() * (STATION_PREFIXES.length - 1))
	]
	const name = STATION_NAMES[
		Math.floor(Math.random() * (STATION_NAMES.length - 1))
	]
	const suffix = STATION_SUFFIXES[
		Math.floor(Math.random() * (STATION_SUFFIXES.length - 1))
	]

	return `${prefix} ${name} ${suffix} ${Math.floor(Math.random() * 1000)}`
}

/**
 * Buy a station for a `stationPrice` amount of price.
 */
function buyStation() {
	// check if we have enough credits and we havent hit the maxcap
	if (credits >= stationPrice && stationsBought < maxStations) {
		// create a new station, this'll be appended
		const name = generateStationName();
		let revenue = randomInRangeF(100, 50);
		if (name.endsWith("777") || name.endsWith("999")){
			revenue += 1000;
			addEventLog(loc.formatString("%events.bsLuckyDay", [stationPrice]), station, "#00aa00")
		}
		const station = new Station(name, 5, revenue, 0, tickNumber, [], 0, false, false, false, false, 0);

		addStation(station) // add the station+renders
		addEventLog(loc.formatString("%events.buyStation", [stationPrice]), station, "#00aa00")
		addCredits(-stationPrice) // remove credits

		// increase price exponentially
		stationPrice = Math.floor(stationPrice *= 1.25);
		stationsBought++;

		// render
		document.getElementById("buyStation").innerHTML = `Buy Station (${stationPrice})`
		document.getElementById("stationsAmount").innerHTML = `${stationsBought}/${maxStations}`
	}
}

window.addEventListener('load', function () {
	// initialize loc

	// properly set buystation, and add the starting credits
	document.getElementById("buyStation").innerHTML = `Buy Station (${stationPrice})`
	addCredits(STARTING_CREDITS);

	// start the ticking
	tick();

	// load data, create data if not exist
	if (localStorage.getItem("nt_sim_data") == null) {
		localStorage.setItem("nt_sim_data", exportData());
		console.log("Created new data.")
	} else {
		importData(localStorage.getItem("nt_sim_data"))
		console.log("Imported data.")
	}

	console.log("Game initialized.")
})

function randomInRange(base, radius) {
	return base + (Math.random() * (radius + 1)) - ((radius + 1) / 2)
}

function randomInRangeF(base, radius) {
	return Math.round(randomInRange(base, radius))
}

//
console.log('%cSkid skid skidddd! if you know how to use the dev console come see us on github!!', 'font-size: 32px; text-shadow: -5px -5px 0 #0019FF, 5px -5px 0 #0019FF, -5px 5px 0 #0019FF, 5px 5px 0 #0019FF;');
console.log('%chttps://github.com/Just-a-Unity-Dev/nanotrasen-simulator', 'font-size: 16px; text-shadow: -5px -5px 0 #0019FF, 5px -5px 0 #0019FF, -5px 5px 0 #0019FF, 5px 5px 0 #0019FF;');
