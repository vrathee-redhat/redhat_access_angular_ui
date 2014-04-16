//See http://expressjs.com/3x/api.html
express = require('express');
var app = express();
app.use(express.bodyParser());

//Case attachment mocks
app.get('/attachments', function (req, res) {
	res.send('/Main Server SOS Report?checked=true\n/Database Log?checked=true\n/Debug/katello-debug.log\n/Debug/Level3/foreman.debug');
	//res.send('/Main SOS Report/\n/Database Log')
	//\n/root2/sub1/sub2\n/root3/sub1/sub2\n')
	// res.json(
	// 	[{
	// 		"name": "Satellite Main",
	// 		"checked": false,
	// 		"children": [{
	// 			"name": "SOS report",
	// 			"checked": false,
	// 			"children": []
	// 		}, {
	// 			"name": "Satellite Proxy 2",
	// 			"children": []
	// 		}, {
	// 			"name": "Satellite proxy 3",
	// 			"checked": false,
	// 			"children": []
	// 		}]
	// 	}]
	// );

	// res.json([{
	// 	"name": "root",
	// 	"children": [{
	// 		"name": "sub1",
	// 		"children": [{
	// 			"name": "sub2",
	// 			"children": [

	// 			]
	// 		}]
	// 	}]
	// }, {
	// 	"name": "root2",
	// 	"children": [{
	// 		"name": "sub12",
	// 		"children": [{
	// 			"name": "sub13",
	// 			"children": [

	// 			]
	// 		}]
	// 	}]
	// }])
});
app.post('/attachments', function (req, res) {
	console.log(req.body);
	res.json({
		'foo': 'myMockJSON'
	});
});


//Log Viewer mocks
app.get('/GetMachineList', function (req, res) {
	res.send("[ \"RHEV Manager\", \"Hypervisor 1\", \"Hypervisor 2\"]");
});
app.get('/GetFileList', function (req, res) {
	res.send('/root/sub1/sub2\n/root2/sub21/sub22\n/root3/sub31/sub32\n/root3/sub31/sub34\n');
});
app.get('/GetLogFile', function (req, res) {
	res.send('This is a mock Log file. For RHEV. I am having installation issues.');
});
app.get('/machines', function (req, res) {
	res.send("[ \"RHEV Manager\", \"Hypervisor 1\", \"Hypervisor 2\"]");
});
app.get('/logs', function (req, res) {
	var path = req.query.path;
	if(path == null){
		res.send('/root/sub1/sub2\n/root2/sub21/sub22\n/root3/sub31/sub32\n/root3/sub31/sub34\n');
	} else {
		res.send('Mock file text fdsafdsafjklsdjfkldsjfkldsjfkldsjfkldsjklfjdsklafjkldsajfkldsajfkl;dsajfkl;dsjaklfjasdklfjdsklfjkldsajfkdasjfkljsdaklfjasdklfjkldsajfkdlsajfkldsjfkldsajfkldsajfklasdfjkl;asdfjkldsa');
	}
});


module.exports = app