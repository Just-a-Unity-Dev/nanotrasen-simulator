let tickNumber = 0; // So we know what tick it is. Can be manipulated by importData

function tick() {
	setTimeout(tick, 100); // Run every 100ms, 10 ticks per second
	tickNumber++; // Increment tickNumber

	// Tick each station
	for (let i = 0; i < stations.length; i++) {
		const station = stations[i];
		station.tick(tickNumber);
	}

	if (tickNumber % 50 === 0)	runRandomEvent(); // Run event every 50 ticks (5 seconds)
	if (tickNumber % 500 === 0)	{ // Autosave every 500 ticks
		localStorage.setItem("nt_sim_data", exportData());
		console.log("Autosaved.")
	}
}
