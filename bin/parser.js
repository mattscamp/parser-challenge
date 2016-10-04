#!/usr/bin/env node
var Parser = require('../lib').Parser;
var endpoints = [
	"GET /api/users/{user_id}/count_pending_messages",
  	"GET /api/users/{user_id}/get_messages",
  	"GET /api/users/{user_id}/get_friends_progress",
  	"GET /api/users/{user_id}/get_friends_score",
  	"POST /api/users/{user_id}",
  	"GET /api/users/{user_id}"
];

var parser = new Parser({ endpoints: endpoints, logFile: './sample.log' });

/*

__________.__               .__        ___.     _________ .__           .__  .__                               
\______   |  | _____  ___.__|  | _____ \_ |__   \_   ___ \|  |__ _____  |  | |  |   ____   ____   ____   ____  
 |     ___|  | \__  \<   |  |  | \__  \ | __ \  /    \  \/|  |  \\__  \ |  | |  | _/ __ \ /    \ / ___\_/ __ \ 
 |    |   |  |__/ __ \\___  |  |__/ __ \| \_\ \ \     \___|   Y  \/ __ \|  |_|  |_\  ___/|   |  / /_/  \  ___/ 
 |____|   |____(____  / ____|____(____  |___  /  \______  |___|  (____  |____|____/\___  |___|  \___  / \___  >
                    \/\/              \/    \/          \/     \/     \/               \/     \/_____/      \

*/
parser.aggregate(function(data) {
	for (k in data) {
		var point = data[k];
		console.log(point.path + " - CALLS: " + point.calls + " MEAN: " + point.mean + " MEDIAN: " + point.median + " MODE: " + point.mode + " DYNO: " + point.dyno);
	}
	return;
});