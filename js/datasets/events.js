class Rumor extends Event {
	name = "Rumor"
	message = "%events.rumor";
	color = "#aa0000"
	threat = 30

	changedUnrest = 20

	minimumUptime = 50
}

class AntagMajor extends Event {
	name = "Antag Major"
	message = "%events.antagMajor";
	color = "#aa0000"
	threat = 80

	changedUnrest = 50
	changedRevenue = -500
	changedCredits = -1500

	minimumUptime = 180
}

class ThiefCaughtFail extends Event {
	name = "Thief";
	message = "%events.thiefCaughtFail";
	color = "#00aa00";
	threat = 10;

	changedUnrest = -10

	minimumUptime = 30
}

class ThiefCaughtSucceed extends Event {
	name = "Thief";
	message = "%events.thiefCaughtSucceed";
	color = "#aa0000"
	threat = 20;

	changedUnrest = 10
	changedRevenue = -50
	changedCredits = -150

	minimumUptime = 30
	minimumCrew = 40
}

class EnemyCommunicationIntercepted extends Event {
	name = "Enemy Communication Intercepted"
	message = "%events.enemyCommunicationIntercepted";
	threat = -1

	changedUnrest = 25

	minimumUptime = 50
	minimumCrew = 20

	run(station){
		addEventLog(this.message, station, "#0000aa")
		intercept.play();
	}
}

class PlasmaBubble extends Event {
	name = "Plasma Bubble"
	message = "%events.plasmaBubble"
	threat = -1
	color = "#ff00ff"

	changedRevenue = 50
	changedCredits = 500

	minimumUptime = 15
	minimumCrew = 10
}

class ThiefDetected extends Event {
	name = "Thief";
	message = "%events.thiefDetected"
	threat = 30;

	changedUnrest = 15

	minimumUptime = 30
	minimumCrew = 40
}

class TraitorDetained extends Event {
	name = "Syndicate Agent";
	message = "%events.traitorDetained"
	threat = 30;

	changedUnrest = 15
	changedRevenue = -25

	minimumUptime = 60
	minimumCrew = 50
}

class NTRumors extends Rumor {
	name = "Rumors";
	message = "%events.ntRumors";
	threat = 40;

	changedUnrest = 25;
	minimumUptime = 80;
}

class LingRumor extends Rumor {
	name = "Changeling Rumors";
	message = "%events.lingRumor";
	threat = 40;
}

class AIActivity extends Rumor {
	name = "Disturbing AI Activity";
	message = "%events.aiActivity";
	threat = 40;
}

class WizardRumors extends Rumor {
	name = "Wizard Rumors";
	message = "%events.wizardRumors";
	threat = 50;
}

class ForeignLifeformsMinor extends Rumor {
	name = "Foreign Lifeforms";
	message = "%events.foreignLifeformsMinor";
	threat = 50;
}

class InsanityWave extends Event {
	name = "Insanity Wave";
	message = "%events.insanityWave";
	threat = 50;
	color = "#aa0000"

	changedUnrest = 35
}

class BluespaceAnomaly extends Event {
	name = "Bluespace Anomaly";
	message = "%events.bluespaceAnomaly";
	threat = 50;

	run(station) {
		addEventLog(this.message, station, "#0000ff")
		spanomalies.play()
		station.addUnrest(
			Math.floor(randomInRangeF(0, 50))
		);
		station.addRevenue(randomInRangeF(250, 500));
	}
}

class StationFunding extends Event {
	name = "Station Funding"
	message = "%events.stationFunding";
	threat = -1;

	run(station) {
		const creditsChange = Math.floor((Math.random() * 1000) + 500);
		addEventLog(this.message, station, "#aa0000");
		addCredits(-Math.abs(creditsChange))
		station.addRevenue(15)
	}
}

class CargoUnauthOrder extends Event {
	name = "Unauthorized Cargo Order"
	message = "%events.cargoUnauthOrder";
	threat = -1;

	changedCredits = -250
	changedUnrest = -15
	changedRevenue = 50
}

class SalvageArtifactGood extends Event {
	name = "Salvage Artifact: Good"
	message = "%events.salvageArtifactGood";
	threat = -1;

	changedCredits = 150
	changedRevenue = 50
}

class MeteoriteGood extends Event {
	name = "Meteor: Good"
	message = "%events.meteoriteGood";
	threat = -1

	changedCredits = 250

	run(station) {
		addEventLog(this.message, station);
		meteors.play();
	}
}

class MeteoriteBad extends MeteoriteGood {
	name = "Meteor: Bad"
	message = "%events.meteoriteBad"
	threat = -1

	changedCredits = -150
}

class BotanyProductivity extends Event {
	name = "Productive Botany"
	message = "%events.botanyProductivity";

	changedRevenue = 150
	changedUnrest = -25
}

class CryopodFriendly extends Event {
	name = "Cryopod: Friendly"
	message = "%events.cryopodFriendly"

	changedCrew = 5
}

class CryopodNeutral extends Event {
	name = "Cryopod: Neutral"
	message = "%events.cryopodNeutral"

	changedCrew = 5
	changedUnrest = 15
}

class CryopodHostile extends Event {
	name = "Cryopod: Hostile"
	message = "%events.cryopodHostile"

	changedCrew = -3
	changedUnrest = 20
}

class NuclearEmergencyFailure extends Event {
	name = "Failed Nuclear Operation"
	message = "%events.nuclearEmergencyFailure"
	threat = 70;

	run(station) {
		addEventLog(this.message, station, "#00aa00")
		station.addRevenue(500);
	}
}

class NuclearEmergencySuccess extends AntagMajor {
	name = "Successful Nuclear Operation"
	message = "%events.nuclearEmergencySuccess"
	threat = 100;

	run(station) {
		operatives.play();
		addEventLog(this.message, station, this.color);
		station.destroy();
	}
}

class MalfAISuccess extends AntagMajor {
	name = "Malfunctioning AI"
	message = "%events.malfAiSuccess"
	threat = 100;

	run(station) {
		addEventLog(this.message, station, this.color);
		malfai.play()
		station.destroy();
	}
}

class BloodCultSuccess extends AntagMajor {
	name = "Blood Cult Success"
	message = "%events.bloodCultSuccess"
	threat = 100;

	minimumCrew = 15;

	run(station) {
		spanomalies.play()
		addEventLog(this.message, station, this.color);
		station.destroy();
	}
}

class RevolutionSuccess extends Event {
	name = "Viva Revolution!"
	message = "%events.revolutionSuccess"
	threat = -1;
	color = "#aa0000";

	minimumUnrest = 90;

	run(station) {
		addEventLog(this.message,station,this.color);
		station.booleans.revolution = true;
	}
}

class WizardSuccess extends AntagMajor {
	name = "Successful Wizard Attack"
	message = "%events.wizardSuccess"
	threat = 100;

	minimumUnrest = 50;
	changedCrew = -100;

	run(station) {
		wizards.play()
		addEventLog(this.message, station, this.color);
	}
}

class Tragedy extends Event {
	// -1 threat means it can happen anytime.
	name = "Tragedy"
	message = "%events.tragedy"
	threat = -1;

	changedCrew = -1;
}


const eventPool = [
	new NuclearEmergencySuccess(),
	new WizardSuccess(),
	new MalfAISuccess(),
	new BloodCultSuccess(),

	new NuclearEmergencyFailure(),

	new CryopodHostile(),
	new CryopodNeutral(),
	new CryopodFriendly(),
	new BotanyProductivity(),
	new MeteoriteGood(),
	new MeteoriteBad(),
	new SalvageArtifactGood(),
	new CargoUnauthOrder(),
	new StationFunding(),

	new ThiefDetected(),
	new TraitorDetained(),
	new ThiefCaughtSucceed(),
	new ThiefCaughtFail(),
	new EnemyCommunicationIntercepted(),
	new PlasmaBubble(),
	new NTRumors(),
	new LingRumor(),
	new AIActivity(),
	new WizardRumors(),
	new ForeignLifeformsMinor(),
	new InsanityWave(),
	new BluespaceAnomaly(),

	new Tragedy()
]
