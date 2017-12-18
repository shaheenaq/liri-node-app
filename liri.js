
var keys = require("./keys.js");
var tKeys = keys.twitterKeys;
var sKeys = keys.spotifyKeys; 

var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var request = require("request");
var fs = require("fs");
var clear = require('clear');
var figlet = require('figlet');
const chalk = require('chalk');

Spotify = new Spotify(sKeys);
Twitter = new Twitter(tKeys);


var liriCommand = process.argv[2];
var titleName = process.argv;
var title = "";

function startLiri(){

	clear();
	console.log(
  		chalk.cyan.bold(
    		figlet.textSync('Liri', { horizontalLayout: 'full' })
  		)
	);


switch (liriCommand) {
	case 'my-tweets':
		getTweets();
		break;
	case 'spotify-this-song':
		searchSong();
		break;
	case 'movie-this':
		searchMovie();
		break;
	case 'do-what-it-says':
		randomFile();
		break;
	default:
		console.log("Try again, enter a Liri command!");
	}
}

function searchSong(){
	
	if(titleName[3] === null){

		Spotify.search({type: 'track', query: 'The Sign'}, function(err, data){
			if(err) {
				return console.log('Error occured: ' + err);
			}

			console.log(chalk.cyan("Artist: ") + data.tracks.items[8].album.artists[0].name);
 			console.log(chalk.cyan("Song: ") + data.tracks.items[8].name);
 			console.log(chalk.cyan("Preview: ") + data.tracks.items[8].preview_url);
 			console.log(chalk.cyan("Album: ") + data.tracks.items[8].album.name);
 		


 		});

	} else{

		for(var i = 3; i < titleName.length; i++){
			title = title + " " + titleName[i];
			}
	 

		Spotify.search({type: 'track', query:"'" + title + "'" }, function(err, data){
			if(err) {
				return console.log('Error occured: ' + err);
			}

			var albumArtist = data.tracks.items[0].album.artists[0].name;
			var songName = data.tracks.items[0].name;
			var preview = data.tracks.items[0].preview_url;
			var albumName = data.tracks.items[0].album.name;

		 	console.log(chalk.cyan("Artist: ") + albumArtist);
		 	console.log(chalk.cyan("Song: ") + songName);
		 	console.log(chalk.cyan("Preview: ") + preview);
		 	console.log(chalk.cyan("Album: ") + albumName);
		 	
		 	var whole = '\n' + albumArtist + '\n' + songName + '\n' + preview +'\n'+ albumName;

		 	fs.appendFile('log.txt', whole, function(err){
			if (err) throw err;
			console.log("Saved in log file.");
			});

		 });

		}
}


function getTweets(){

var params = {screen_name: 'sheena_rk'};

Twitter.get('statuses/user_timeline', params, function(err, tweets, response){

	if(!err) {
		
		var whole = "";
		for(var i = 0; i < 8; i++){
			var dateTweet = tweets[i].created_at;
			var textTweet = tweets[i].text;
			console.log(chalk.cyan("Date of tweet:") + dateTweet);
			console.log(chalk.cyan("Tweet:") + textTweet);
			console.log('------------------------------------------------------------------------------');
			whole = whole + '\n' + dateTweet + '\n' + textTweet;
		}
		fs.appendFile('log.txt', whole, function(err){
			if (err) throw err;
			console.log("Saved in log file.");
		});
	}
});
}

function searchMovie(){

	if(titleName[3] == null){
		title = 'Mr.+Nobody';
	} else {

		for(var i = 3; i < titleName.length; i++){
			title = title + "+" + titleName[i];
		}
	}
request("http://www.omdbapi.com/?t="+"'"+title+"'"+"&y=&plot=short&apikey=trilogy", function(error, response, body){

// If the request is successful (i.e. if the response status code is 200)
  if (!error && response.statusCode === 200) {
  	
    var movieTitle = JSON.parse(body).Title;
    var movieYear = JSON.parse(body).Year;
    var movieRating = JSON.parse(body).imdbRating;
    var movieT = JSON.parse(body).Ratings[1].Source;
    var movieV = JSON.parse(body).Ratings[1].Value;
    var movieCountry = JSON.parse(body).Country;
    var movieLang = JSON.parse(body).Language;
    var movieActors = JSON.parse(body).Actors;
    var moviePlot = JSON.parse(body).Plot;

    console.log(chalk.cyan("Title: ") + movieTitle);
    console.log(chalk.cyan("Year: ") + movieYear);
    console.log(chalk.cyan("IMDB rating: ") + movieRating);
    console.log(chalk.cyan(movieT +" : ") + movieV);
    console.log(chalk.cyan("Country: ") + movieCountry);
    console.log(chalk.cyan("Language: ") + movieLang);
    console.log(chalk.cyan("Actors: ") + movieActors);
    console.log(chalk.cyan("Plot: ") + moviePlot);

    var allInfo = '\n' + movieTitle + '\n' + movieYear + '\n'+ movieRating + '\n'+ movieT + movieV 
    	+ '\n'+ movieCountry+ '\n'+ movieLang + '\n'+ movieActors + '\n'+ moviePlot;
    		
    fs.appendFile('log.txt', allInfo, function(err){
			if (err) throw err;
			console.log("Saved in log file.");
		});
  }
});
}

function randomFile(){
	fs.readFile('random.txt', "utf-8", function(err, data){

		
		var dataArr = data.split(",");
		
		liriCommand = dataArr[0];
		
		var something = dataArr[1].split(" ");
		
		titleName[3] = something;
		startLiri();

	});

}

startLiri();







