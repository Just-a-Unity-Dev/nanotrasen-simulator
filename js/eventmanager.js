let threatLevel = 20;

/**
 * Abstract event class that all Events inherit from.
 * @abstract
 */
class Event {
	name = "Null";
	message = "Nothing. What did you expect."
	color = "#000000"
	threat = null;

	changedCredits = 0
	changedRevenue = 0
	changedUnrest = 0
	changedCrew = 0

	minimumCredits = 0
	minimumUnrest = 0
	minimumUptime = 0
	minimumCrew = 0

	run(station) {addEventLog(this.message, station, this.color)}
}

/**
 * Adds a log in the Events category with a message and color.
 * @param {string} message
 * @param {Station} station
 * @param {string} color
 */
function addEventLog(message, station, color) {
	const id = (Math.random() + 1).toString(36).substring(7); // get random ID string
	let paragraph = document.createElement("p"); // create paragraph

	// Replace every instance of (STATION_NAME) with the actual station name.
	message = loc.getString(message);
	message = message.replace("(STATION_NAME)", `<strong>${station.name}</strong>`)
	// TODO: Make this better
	paragraph.innerHTML = `<button onclick="document.getElementById('${id}').parentNode.removeChild(document.getElementById('${id}'))">Close event</button> ${message}`;

	// Change styles/id
	paragraph.style.color = color
	paragraph.id = id;

	document.getElementById("events").prepend(paragraph)
}

// thanks stack overflow.
function shuffleArray(array) {
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}


/**
 * Calculates a threat level and runs the corresponding event from the `eventPool`.
 */
function runRandomEvent() {
	// Check if we have ANY stations at all. Stop yelling at me JS.
	if (stations.length > 0) {
		threatLevel = parseInt(Math.floor(Math.random() * 2) == 0 ? threatLevel + 10 : threatLevel - 10);

		console.log(threatLevel);

		// Clamp threatlevel
		if (threatLevel > 100) threatLevel = 100;
		if (threatLevel < 10) threatLevel = 10;
                // Need to shuffle array else shit can get stuck
                shuffleArray(eventPool)

		// For everything in the event pool
		// Yes. I know this is bad. Refactor it.
		for (let i = 0; i < eventPool.length; i++) {
			let station = stations[Math.floor(Math.random() * stations.length)]
			const event = eventPool[i];

			// Event checks
			if (
				(threatLevel == parseInt(event.threat) || parseInt(event.threat) == -1) &&
				credits >= parseInt(event.minimumCredits) &&
				station.unrest >= parseInt(event.minimumUnrest) &&
				station.uptimeTime >= parseInt(event.minimumUptime) &&
				station.crew >= parseInt(event.minimumCrew)
			) {
				// If so run event on the station

				runEvent(event, station);

				// Break out of for loop since we're done with it.
				break;
			} else {
				// Otherwise reset and try again
				console.log(`"${event.name}" failed to run, failed checks. Threat level: ${threatLevel}, event threat level: ${event.threat}`)
			}
		}
	}
}

/**
 * Runs a specific event, if you want a random event use `runRandomEvent()`
 * @param {Event} event
 */
function runEvent(event, station) {
	addCredits(parseInt(event.changedCredits));
	station.addRevenue(parseInt(event.changedRevenue));
	station.addUnrest(parseInt(event.changedUnrest), false);
	station.addCrew(event.changedCrew);

	// Run the function in the class allowing for some custom
	// javascript, defaults to an addEventLog.
	// Used by events such as NuclearOperativesSuccess
	// to destroy the station, or do something else with it
	event.run(station);

	console.log(`Event "${event.name}" has been run.`)
}
