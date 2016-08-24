/*//===
	Technobase MP3 Streamer
*///===

var request = require('request'),
	fs = require('fs'),
	tracklist = require('./tracklist'),
	tracklistStream = tracklist.getStream(),
	masterStream = request('http://listen.technobase.fm/tunein-mp3-pls'),
	stream = require('stream'),
	nodeID3 = require('node-id3'),
	state = null;

tracklistStream.on('song', (data) => {
	console.log("Recording song: " + data.title + ' - ' + data.artist);
	state = data.state;

	var file = './recordings/' + data.title + ' - ' + data.artist + ' .mp3',
	checkInterval = setInterval(() => {
		if(data.state != state){
			masterStream.removeListener('data', handler);
			clearInterval(checkInterval);
			writeStream.end();
			nodeID3.write(data, file);
		}
	}, 1000),
	writeStream = fs.createWriteStream(file),
	handler = function(bit){
		writeStream.write(bit);
	}

	masterStream.on('data', handler)
})