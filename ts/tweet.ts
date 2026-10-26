class Tweet {
	private text:string;
	time:Date;

	constructor(tweet_text:string, tweet_time:string) {
        this.text = tweet_text;
		this.time = new Date(tweet_time);//, "ddd MMM D HH:mm:ss Z YYYY"
	}

	//returns either 'live_event', 'achievement', 'completed_event', or 'miscellaneous'
    get source():string {
        if (this.text.includes("#RKLive")) {
            return "live_event";
        }
        if (this.text.includes("completed") || this.text.includes("posted")) {
            return "completed_event";
        }
        if (this.text.includes("#FitnessAlerts") || this.text.includes(" pb ") || this.text.includes(" pr ")) {
            return "achievement";
        }
        return "miscellaneous";
    }

    //returns a boolean, whether the text includes any content written by the person tweeting.
    get written():boolean {
        return this.source === "completed_event" && this.text.includes(" - ");
    }

    get writtenText():string {
        if (!this.written) {
            return "";
        }
        // everything after the first " - ", without the trailing link and hashtag
        return this.text
            .substring(this.text.indexOf(" - ") + 3)
            .replace(/https?:\/\/\S+/g, "")
            .replace(/#\w+/g, "")
            .trim();
    }

    get activityType():string {
        if (this.source != 'completed_event') {
            return "unknown";
        }

        // distance format
        const match = this.text.match(/\d(?:\.\d+)? (?:km|mi) (.+?)(?: with | - |$)/);
        if (!match) {
            // weed out time based activities
            return "unknown";
        }

        const activity = match[1].toLowerCase();

        // categories
        switch (true) {
            case activity.includes("walk"):
                return "walk";
            case activity.includes("bike"):
                return "bike";
            case activity.includes("run "):
                return "run";
            default:
                return activity;
        }
    }

    // distance in miles
    get distance():number {
        if (this.source != 'completed_event') {
            return 0;
        }
        const match = this.text.match(/(\d+(?:\.\d+)?)\s*(km|mi)\b/);
        if (!match) {
            return 0;
        }
        const value = parseFloat(match[1]);
        return match[2] === "mi" ? value : value / 1.609;
    }

    getHTMLTableRow(rowNumber:number):string {
        // turn every URL in the tweet into a clickable link
        const linkedText = this.text.replace(
            /https?:\/\/\S+/g,
            url => `<a href="${url}" target="_blank">${url}</a>`
        );
        return `<tr><td>${rowNumber}</td><td>${this.activityType}</td><td>${linkedText}</td></tr>`;
    }
}