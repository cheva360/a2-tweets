let written_tweets = [];

function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	// keep only the user-written completed tweets
	written_tweets = runkeeper_tweets
		.map(tweet => new Tweet(tweet.text, tweet.created_at))
		.filter(t => t.written);
}

function addEventHandlerForSearch() {
	const searchBox = document.getElementById('textFilter');
	const table = document.getElementById('tweetTable');
	const searchCount = document.getElementById('searchCount');
	const searchText = document.getElementById('searchText');

	// "input" fires after every character is added or removed
	searchBox.addEventListener('input', function () {
		const query = searchBox.value;
		searchText.innerText = query;

		// clear the table when the search box is empty
		if (query === "") {
			table.innerHTML = "";
			searchCount.innerText = 0;
			return;
		}

		const lowerQuery = query.toLowerCase();
		const matches = written_tweets.filter(t => t.text.toLowerCase().includes(lowerQuery));

		searchCount.innerText = matches.length;
		table.innerHTML = matches
			.map((t, i) => t.getHTMLTableRow(i + 1))
			.join("");
	});
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	addEventHandlerForSearch();
	loadSavedRunkeeperTweets().then(parseTweets);
});