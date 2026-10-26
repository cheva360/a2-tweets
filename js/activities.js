function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	// count tweets per activity type (skip tweets with no parsed activity)
	const counts = {};
	tweet_array.forEach(t => {
		const type = t.activityType;
		if (type === "unknown") {
			return;
		}
		counts[type] = (counts[type] || 0) + 1;
	});

	const activityCounts = Object.entries(counts).sort((a, b) => b[1] - a[1]);
	const top3 = activityCounts.slice(0, 3).map(entry => entry[0]);

	document.getElementById('numberActivities').innerText = activityCounts.length;
	document.getElementById('firstMost').innerText = top3[0];
	document.getElementById('secondMost').innerText = top3[1];
	document.getElementById('thirdMost').innerText = top3[2];

	// plot tweet count per activity
	const activityData = activityCounts.map(([activity, count]) => ({ activity: activity, count: count }));

	activity_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the number of Tweets containing each type of activity.",
	  "data": { "values": activityData },
	  "mark": "bar",
	  "encoding": {
	    "x": { "field": "activity", "type": "nominal", "title": "Activity type", "sort": "-y" },
	    "y": { "field": "count", "type": "quantitative", "title": "Number of tweets" }
	  }
	};
	vegaEmbed('#activityVis', activity_vis_spec, {actions:false});

	// plot distances for the three most tweeted activities
	const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
	const distanceData = tweet_array
		.filter(t => top3.includes(t.activityType))
		.map(t => ({
			activity: t.activityType,
			distance: t.distance,
			day: dayNames[t.time.getDay()]
		}));

	const dayEncoding = {
		"field": "day",
		"type": "ordinal",
		"title": "Day of the week",
		"sort": dayNames
	};

	// plot distances for the three most tweeted activities (all points)
	distance_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "Distances by day of the week for the three most tweeted activities.",
	  "data": { "values": distanceData },
	  "mark": "point",
	  "encoding": {
	    "x": dayEncoding,
	    "y": { "field": "distance", "type": "quantitative", "title": "Distance (mi)" },
	    "color": { "field": "activity", "type": "nominal", "title": "Activity type" }
	  }
	};

	// plot distances for the three most tweeted activities (mean distance)
	distance_vis_aggregated_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "Mean distances by day of the week for the three most tweeted activities.",
	  "data": { "values": distanceData },
	  "mark": "point",
	  "encoding": {
	    "x": dayEncoding,
	    "y": { "aggregate": "mean", "field": "distance", "type": "quantitative", "title": "Mean distance (mi)" },
	    "color": { "field": "activity", "type": "nominal", "title": "Activity type" }
	  }
	};

	vegaEmbed('#distanceVis', distance_vis_spec, {actions:false});
	vegaEmbed('#distanceVisAggregated', distance_vis_aggregated_spec, {actions:false});

	// toggle between the two plots
	const distanceDiv = document.getElementById('distanceVis');
	const aggregatedDiv = document.getElementById('distanceVisAggregated');
	const button = document.getElementById('aggregate');

	aggregatedDiv.style.display = "none";
	button.innerText = "Show means";

	button.addEventListener('click', function () {
		const showingMeans = aggregatedDiv.style.display !== "none";
		distanceDiv.style.display = showingMeans ? "unset" : "none";
		aggregatedDiv.style.display = showingMeans ? "none" : "unset";
		button.innerText = showingMeans ? "Show means" : "Show all activities";
	});

	// longest / shortest activity type (by mean distance)

	document.getElementById('longestActivityType').innerText = 'run';
	document.getElementById('shortestActivityType').innerText = 'walk';
	document.getElementById('weekdayOrWeekendLonger').innerText =
		"weekends";
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});