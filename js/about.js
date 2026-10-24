function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});
	
	//This line modifies the DOM, searching for the tag with the numberTweets ID and updating the text.
	document.getElementById('numberTweets').innerText = tweet_array.length;	

	//convert the created_at strings to Date objects
	toLocaleDateString = function (tweet) {
		return new Date(tweet.created_at).toLocaleDateString();
	}

	//modify id "firstDate" and "lastDate" to show the first and last dates of the tweets in the array
	document.getElementById('firstDate').innerText = toLocaleDateString(runkeeper_tweets[runkeeper_tweets.length - 1]);
	document.getElementById('lastDate').innerText = toLocaleDateString(runkeeper_tweets[0]);

    
	// count tweets by source using the Tweet class
	const counts = { completed_event: 0, live_event: 0, achievement: 0, miscellaneous: 0 };
	let writtenCount = 0;

	tweet_array.forEach(t => {
		counts[t.source]++;
		if (t.written) {
			writtenCount++;
		}
	});

	const total = tweet_array.length;
	const pct = (n, d) => (d > 0 ? (n / d) * 100 : 0).toFixed(2) + "%";

	//write to the DOM
	document.getElementsByClassName('completedEvents')[0].innerText = counts.completed_event;
	document.getElementsByClassName('completedEvents')[1].innerText = counts.completed_event;
	document.getElementsByClassName('completedEventsPct')[0].innerText = pct(counts.completed_event, total);
	document.getElementsByClassName('liveEvents')[0].innerText = counts.live_event;
	document.getElementsByClassName('liveEventsPct')[0].innerText = pct(counts.live_event, total);
	document.getElementsByClassName('achievements')[0].innerText = counts.achievement;
	document.getElementsByClassName('achievementsPct')[0].innerText = pct(counts.achievement, total);
	document.getElementsByClassName('miscellaneous')[0].innerText = counts.miscellaneous;
	document.getElementsByClassName('miscellaneousPct')[0].innerText = pct(counts.miscellaneous, total);
	document.getElementsByClassName('written')[0].innerText = writtenCount;
	document.getElementsByClassName('writtenPct')[0].innerText = pct(writtenCount, counts.completed_event);
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});