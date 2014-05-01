//See http://expressjs.com/3x/api.html
express = require('express');
var app = express();
app.use(express.bodyParser());

//Case attachment mocks
app.get('/attachments', function (req, res) {
	res.send('Main Server SOS Report?checked=true\n/Database Log?checked=true\n/Debug/katello-debug.log\n/Debug/Level3/foreman.debug\nFail-409\nFail-500');
	
});
app.post('/attachments', function (req, res) {
	console.log(req.body.attachment);

	if (req.body.attachment === 'Fail-500'){
		res.status(500);
	}
	if (req.body.attachment === 'Fail-409'){
		res.status(409);
	}
	var respond = function () {
		res.json({
			'foo': 'myMockJSON'
		});
	}
	setTimeout(respond, 1000);

});


//Log Viewer mocks
app.get('/machines', function (req, res) {
	res.send("[ \"RHEV Manager\", \"Hypervisor 1\", \"Hypervisor 2\"]");
});
app.get('/logs', function (req, res) {
	var path = req.query.path;
	if (path == null) {
		res.send('/root/sub1/sub2\n/root2/sub21/sub22\n/root3/sub31/sub32\n/root3/sub31/sub34\n');
	} else {
		res.send('Mock file text fdsafdsafjklsdjfkldsjfkldsjfkldsjfkldsjklfjdsklafjkldsajfkldsajfkl;dsajfkl;dsjaklfjasdklfjdsklfjkldsajfkdasjfkljsdaklfjasdklfjkldsajfkdlsajfkldsjfkldsajfkldsajfklasdfjkl;asdfjkldsa');
	}
});


module.exports = app