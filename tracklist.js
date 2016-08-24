/*//===
	Technobase Tracklist
*///===

var events = require('events'),
	cheerio = require('cheerio'),
	request = require('request'),
	md5 = require('md5'),
	state = null,
	songs = [],
	stream = new events.EventEmitter();


function getList(then){
	then = then || function(){};

	var buffer = '';

	request('http://www.technobase.fm/tracklist/')
		.on('data', (bit) => {buffer += bit;})
		.on('end', () => {
			var $ = cheerio.load(buffer),
				build = '';
			$('.news2 table').each(function(){
				var line = $('th', this).text()
				build += line;
			})

			var thisState = md5(build);

			if(thisState != state){
				var list = [];
				$('.news2 table').each(function(){
					var line = $('th', this).text(),
						parts = line.split(' - ');
					list.push({
						title : parts[1],
						artist : parts[0],
						state : thisState
					});
				})
				songs = list;
				stream.emit('song', songs[0]);
			}

			state = thisState;

		})
}

getList();
setInterval(getList, 1000 * 10);

module.exports = {
	getStream : () => {return stream;},
	getSongs : () => {return songs;}
}