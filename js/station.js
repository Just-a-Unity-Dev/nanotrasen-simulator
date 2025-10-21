/**
 * Station class.
 */
class Station {
	name = "Station Station"
	rawRevenue = 1000
	unrest = 0
	upgrades = [] // No upgrades. Fuck you.
	shuttleSent = 0
	booleans = {
		revolution: false,
		ertSent: false,
		decomissioned: false,
	}
	createdOn = 0;

	offsetPPC = 0;
	crewmemberPrice = 150;
	crew = 5;
	currentTick = 0;

	requireUpkeep = true;

	constructor(name,crew,rawRevenue,unrest,tickCreated,upgrades,offsetPPC,revs,ertSent,decomissioned,missing,shuttleSent) {
		this.name = name
		this.crew = crew
		this.rawRevenue = rawRevenue
		this.unrest = unrest
		this.upgrades = upgrades
		this.offsetPPC = offsetPPC
		this.shuttleSent = shuttleSent
		this.booleans.revolution = revs
		this.booleans.ertSent = ertSent
		this.booleans.decomissioned = decomissioned
		this.booleans.missing = missing
		this.createdOn = tickCreated
	}

	tick(tickNumber) {
		this.currentTick = tickNumber; // Assign current tick BEFORE anything tick-related begins.
		const div = document.getElementById(this.createdOn)

		if (this.uptimeTick % 10 === 0 && !this.booleans.missing) {
			// More crewmembers being paid well = More revenue, but more bad events
			// Less crewmembers = Less revenue but less bad events
			addCredits(this.booleans.revolution ? -this.rawRevenue : this.revenue);
		}

		if (this.uptimeTick % 20 === 0 && !this.booleans.missing) {
			if (this.requireUpkeep && this.booleans.revolution == false) {
				if (this.payPerCrewmember < this.desiredPPC) {
					addEventLog("Crewmembers aboard (STATION_NAME) believe that they aren't being paid good enough for their hard work! Civil unrest increased.", this, "#aa0000")
					this.addUnrest(Math.floor(Math.random() * 8) + 1);
				} else {
					// Removed due to the stupid amount of log spamming there was
					// addEventLog(`Nanotrasen paid ${this.crew} crewmembers ${this.payPerCrewmember} credits aboard (STATION_NAME). Civil unrest decreased.`, this, "#aa0000")
					this.addUnrest(-1);
				}
			} else if (this.booleans.revolution) {
				this.addRevenue(Math.floor(Math.random() * 4) + 1)
			}
		}

		// Paragraphs
		div.getElementsByClassName("station_revenue")[0].innerHTML = `${this.booleans.revolution ? `-Cr${this.revenue.toLocaleString()}` : `Cr${this.profit.toLocaleString()}`} <img src="assets/images/payment.svg" style="width: 18px; vertical-align: middle;" alt="payment icon"></img>`
		div.getElementsByClassName("station_details")[0].innerHTML = `Makes Cr${this.revenue.toLocaleString()}, costs Cr${this.expenses.toLocaleString()}`
		div.getElementsByClassName("station_unrest")[0].innerHTML = `${this.unrest.toLocaleString()} <img src="assets/images/flag.svg" style="width: 18px; vertical-align: middle;" alt="flag icon"></img>`
		div.getElementsByClassName("station_uptime")[0].innerHTML = `${this.uptimeTime.toLocaleString()} <img src="assets/images/timer.svg" style="width: 18px; vertical-align: middle;" alt="timer icon"></img>`
		div.getElementsByClassName("station_crew")[0].innerHTML = `${this.crew.toLocaleString()} <img src="assets/images/person.svg" style="width: 18px; vertical-align: middle;" alt="person icon"></img>`

		div.getElementsByClassName("station_ppc")[0].innerHTML = `Pay per crew: ${this.payPerCrewmember.toLocaleString()} | Desired PPC: ${this.desiredPPC.toLocaleString()}`;


		// Revolution
		// div.getElementsByClassName("station_sell")[0].disabled = this.booleans.revolution
		div.getElementsByClassName("station_abandon")[0].style.display = this.booleans.missing ? "block" : "none"
		div.getElementsByClassName("station_invest")[0].disabled = this.booleans.revolution || this.booleans.missing
		div.getElementsByClassName("station_crewadd")[0].disabled = this.booleans.revolution || this.booleans.missing
		div.getElementsByClassName("station_crewremove")[0].disabled = this.booleans.revolution || this.booleans.missing

		div.getElementsByClassName("station_demands")[0].style.display = this.booleans.revolution ? "block" : "none"
		div.getElementsByClassName("station_ert")[0].style.display = this.booleans.missing ? "block" : "none"
		div.getElementsByClassName("station_ds")[0].style.display = this.booleans.revolution ? "block" : "none"

		div.getElementsByClassName("station_addPPC")[0].disabled = this.booleans.revolution
		div.getElementsByClassName("station_adddPPC")[0].disabled = this.booleans.revolution
		div.getElementsByClassName("station_remPPC")[0].disabled = this.booleans.revolution
		div.getElementsByClassName("station_remmPPC")[0].disabled = this.booleans.revolution

		div.getElementsByClassName("station_overtaken")[0].style.display = this.booleans.revolution ? "block" : "none"
		div.getElementsByClassName("station_missing")[0].style.display = this.booleans.missing ? "block" : "none"

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
		this.rawRevenue = 0;
		this.requireUpkeep = false;

		stationsBought--;
		document.getElementById("stationsAmount").innerHTML = `${stationsBought}/${maxStations}`
		stations = stations.filter((element) => {return this != element})
	}

	abandon() {
		erase.play();
		addEventLog("You abandon (STATION_NAME) after they disappear off the comm-link.", this, `red`)
		this.destroy()
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

	get investmentPrice() {
		return Math.max(this.revenue, 1)
	}

	investStation() {
		if (credits > this.investmentPrice) {
			addCredits(-this.investmentPrice)
			if (randint(0, 100) == 0) {
				this.addRevenue(100);
				addEventLog(`Nanotrasen invests into critical key infrastructure at (STATION_NAME), this pays off!`, this, `gold`)
			} else {
				this.addRevenue(1);
			}
		}
	}

	sendDeathsquad() {
		deathsquad.play()
		addEventLog(`The deathsquad was sent to exterminate (STATION_NAME) from traitors of Nanotrasen. The team succeeded.`, this, "#3c4fffff");
		this.offsetPPC = 0;
		addCredits(-1_000_000) // Figure out actual team management and stuff
		this.booleans.revolution = false;
		this.addUnrest(-100);
		this.crew = 1;
	}
	sendErt() {
		const selection = randint(0, 3);
		if (threatLevel > 80) {
			selection++;
		}

		let extraMessage = ""

		switch (selection) {
			case 0:
				extraMessage = "and reported everything was actually way better than normal!"
				this.rawRevenue = Math.ceil(this.rawRevenue * (2 + Math.random()));
				break;
			case 1:
				extraMessage = "and reported everything was actually okay!"
				break;
			case 2:
				extraMessage = "but reported a majority of the crew were killed."
				this.crew = Math.ceil(this.crew * Math.random());
				break;
			case 3:
				extraMessage = "but reported the station required repairs."
				if (credits > 100_000) {
					addCredits(-100_000);
				} else if (credits > 10_000) {
					addCredits(-10_000);
				} else {
					addCredits(-1_000);
				}
				break;
			case 4:
				extraMessage = "but reported the station faced critical damage to infrastructure."
				this.rawRevenue = Math.ceil(this.rawRevenue / (2 + Math.random()));
				break;
			case 5:
				extraMessage = "but reported the rumors were true: the station was destroyed."
				this.destroy();
		}
		this.booleans.missing = false;
		addCredits(-500_000) // Figure out actual team management and stuff
		this.addUnrest(-100);

		addEventLog(`ERT was dispatched to investigate the missing crew of (STATION_NAME). The team succeeded, ${extraMessage}.`, this, "#63b0f3ff");
	}

	addRevenue(revenue) {
		this.rawRevenue += revenue;
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
		if (this.crew <= 0 && !this.booleans.missing) {
			// What is a station without the crew to manage it?
			this.destroy()
		}
	}

	buyCrew(crewmembers) {
		if (this.booleans.missing || this.booleans.revolution)
			return;
		if (credits >= this.crewmemberPrice * crewmembers) {
			this.addCrew(crewmembers);
			addCredits(-this.crewmemberPrice * crewmembers);
		}
	}

	get canRunEvent() {
		return !this.booleans.missing
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
		return Math.max(0, 20 + Math.round(((this.revenue / 10) - this.crew) / 5))
	}

	get uptimeTick() {
		return this.currentTick - this.createdOn
	}

	get uptimeTime() {
		return Math.floor(this.uptimeTick / 10);
	}

	get expenses() {
		return Math.floor(
			Math.max((this.crew * this.payPerCrewmember) / 2, 0) // Divided by two because it's ticked every 20 ticks
		);
	}
	get revenue() {
		return Math.round(
			(this.rawRevenue * Math.max(1, this.crew / 50))
		)
	}

	get profit() {
		return this.revenue - this.expenses
	}

	get payPerCrewmember() {
		return this.desiredPPC + this.offsetPPC
	}
}

dummyStation = new Station("", 0,0,0,[]);
