/**
 * Station class.
 */
class Station {
	name = "Station Station"
	revenue = 1000
	unrest = 0
	upgrades = [] // No upgrades. Fuck you.
	shuttleSent = 0
	booleans = {
		revolution: false,
		ertSent: false,
		decomissioned: false,
	}
	createdOn = 0;
	
	payPerCrewmember = 15;
	crewmemberPrice = 150;
	crew = 5;

	requireUpkeep = true;

	constructor(name,revenue,unrest,tickCreated,upgrades,ppc,revs,ertSent,decomissioned,shuttleSent) {
		this.name = name
		this.revenue = revenue
		this.unrest = unrest
		this.upgrades = upgrades
		this.payPerCrewmember = ppc
		this.shuttleSent = shuttleSent
		this.booleans.revolution = revs
		this.booleans.ertSent = ertSent
		this.booleans.decomissioned = decomissioned
		this.createdOn = tickCreated
	}

	tick(tickNumber) {
		const div = document.getElementById(this.createdOn)

		if ((this.createdOn - tickNumber * -1) % 20 === 0) {
			// More crewmembers being paid well = More revenue, but more bad events
			// Less crewmembers = Less revenue but less bad events
			if (this.booleans.revolution) {
				addCredits(-this.revenue);
			} else {
				addCredits(this.calculatedRevenue);
			}
		}

		if ((this.createdOn - tickNumber * -1) % 10 === 0) {
			if (this.requireUpkeep && this.booleans.revolution == false) {
				addCredits(-Math.floor(this.payPerCrewmember * this.crew));
				if (this.payPerCrewmember < this.desiredPPC) {
					addEventLog("Crewmembers aboard (STATION_NAME) believe that they aren't being paid good enough for their hard work! Civil unrest increased.", this, "#aa0000")
					this.addUnrest(Math.floor(Math.random() * 4) + 1);
				} else {
					// Removed due to the stupid amount of log spamming there was
					// addEventLog(`Nanotrasen paid ${this.crew} crewmembers ${this.payPerCrewmember} credits aboard (STATION_NAME). Civil unrest decreased.`, this, "#aa0000")
					this.addUnrest(-1);
				}
			} else if (this.booleans.revolution) {
				this.addRevenue(Math.floor(Math.random() * 4) + 1)
			}
		}

		if (this.payPerCrewmember < 0) {
			this.payPerCrewmember = 0;
		}

		// Paragraphs
		div.getElementsByClassName("station_revenue")[0].innerHTML = `${this.booleans.revolution ? -this.revenue.toLocaleString() : this.calculatedRevenue.toLocaleString()} <img src="assets/images/payment.svg" style="width: 18px; vertical-align: middle;" alt="payment icon"></img>`
		div.getElementsByClassName("station_unrest")[0].innerHTML = `${this.unrest.toLocaleString()} <img src="assets/images/flag.svg" style="width: 18px; vertical-align: middle;" alt="flag icon"></img>`
		div.getElementsByClassName("station_uptime")[0].innerHTML = `${this.uptime.toLocaleString()} <img src="assets/images/timer.svg" style="width: 18px; vertical-align: middle;" alt="timer icon"></img>`
		div.getElementsByClassName("station_crew")[0].innerHTML = `${this.crew.toLocaleString()} <img src="assets/images/person.svg" style="width: 18px; vertical-align: middle;" alt="person icon"></img>`
		
		div.getElementsByClassName("station_ppc")[0].innerHTML = `CPPC: ${this.payPerCrewmember.toLocaleString()} | DPPC: ${this.desiredPPC.toLocaleString()}`;


		// Revolution
		div.getElementsByClassName("station_sell")[0].disabled = this.booleans.revolution
		div.getElementsByClassName("station_crewadd")[0].disabled = this.booleans.revolution
		div.getElementsByClassName("station_crewremove")[0].disabled = this.booleans.revolution
		
		div.getElementsByClassName("station_demands")[0].style.display = this.booleans.revolution ? "block" : "none"
		// div.getElementsByClassName("station_ert")[0].style.display = this.booleans.revolution ? "block" : "none"
		// div.getElementsByClassName("station_ds")[0].style.display = this.booleans.revolution ? "block" : "none"
		// div.getElementsByClassName("station_ds")[0].style.display = this.booleans.revolution ? "block" : "none"

		div.getElementsByClassName("station_addPPC")[0].disabled = this.booleans.revolution
		div.getElementsByClassName("station_adddPPC")[0].disabled = this.booleans.revolution
		div.getElementsByClassName("station_remPPC")[0].disabled = this.booleans.revolution
		div.getElementsByClassName("station_remmPPC")[0].disabled = this.booleans.revolution

		div.getElementsByClassName("station_overtaken")[0].style.display = this.booleans.revolution ? "block" : "none"

		// div.getElementsByClassName("station_shuttle")[0].innerHTML = `Emergency Shuttle Status: ${this.shuttleStatus}`
	}

	destroy() {
		// In what world must you destroy a station?
		// Do not use if you are decomissioning/selling a station.
		// This is the main thing that destroys the Station instance
		// And the div.

		const div = document.getElementById(this.createdOn);
		
		if (div != null) {
			div.remove();			
		}
		//if (station != null) station.remove() // Station shouldn't even be null unless EU is tinkering with it.
		this.revenue = 0;
		this.requireUpkeep = false;

		stationsBought--;
		document.getElementById("stationsAmount").innerHTML = `${stationsBought}/${maxStations}`
		stations = stations.filter((element) => {return this != element})
	}

	payDemands() {
		if (credits > 10000) {
			const creditsCalc = -Math.floor((credits / 2) + this.revenue);
			addCredits(creditsCalc);
			this.booleans.revolution = false;
			this.addUnrest(-100);
			addEventLog(`Nanotrasen paid ${-creditsCalc} to the revolutionaries of (STATION_NAME) to release the station.`, this, "#aa0000");
		}
	}

	sellStation() {
		addEventLog(`Nanotrasen sold (STATION_NAME) ${credits<this.revenue ? "at a profit" : "at a loss"}.`, this, `#000000`)
		if (credits > this.revenue)	addCredits(-Math.floor(credits / 2));
		else addCredits(Math.floor(credits / 2));
		this.destroy();

	}

	addRevenue(revenue) {
		if (this.revenue > 0) {
			this.revenue += revenue;
		}
	}

	addUnrest(unrest, handleRevolution=true) {
		if (this.unrest >= 0) {
			this.unrest += unrest;
			if (handleRevolution && this.unrest > 100) {
				runEvent(new RevolutionSuccess(), this);	
				this.unrest = 100;
			} else if (!handleRevolution && this.unrest > 100) {
				// borriiinnggg
				this.unrest = 100;
			}

			if (this.unrest < 0) {
				this.unrest = 0;
			}
		}
	}

	addCrew(crewmembers) {
		this.crew += crewmembers
		if (this.crew <= 0) {
			// What is a station without the crew to manage it?
			this.destroy()
		}
	}

	buyCrew(crewmembers) {
		if (credits >= this.crewmemberPrice) {
			this.addCrew(crewmembers);
			addCredits(-this.crewmemberPrice);
		}
	}

	get shuttleStatus() {
		if (this.shuttleSent == 1) {
			return "Bluespace"
		}else if (this.shuttleSent) {
			return "Docked"
		}
		return "Central Command"
	}

	get desiredPPC() {
		return 5 + Math.floor((this.revenue + this.crew) / 10)
	}

	get uptime() {
		return Math.floor(((this.createdOn - tickNumber) * -1) / 10);
	}

	get calculatedRevenue() {
		return this.revenue + this.crew * Math.floor(this.payPerCrewmember)
	}

	export() {
		return {
			name: this.name,
			revenue: this.revenue,
			unrest: this.unrest,
			upgrades: this.upgrades,
			shuttleSent: this.shuttleSent,
			ppc: this.payPerCrewmember,
			revs: this.booleans.revolution,
			ertSent: this.booleans.ertSent,
			decomissioned: this.booleans.decomissioned,
			tickCreated: this.createdOn
		}
	}
}
