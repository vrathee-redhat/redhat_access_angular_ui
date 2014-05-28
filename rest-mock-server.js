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

  if (req.body.attachment === 'Fail-500') {
    res.status(500);
  }
  if (req.body.attachment === 'Fail-409') {
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
    res.send('/root/sub1/sub2\n/root2/sub21/sub22\n/root3/sub31/sub32\n/root3/sub31/sub34\n/Fail\n');
  } else {
    if (path.indexOf("Fail") > -1) {
      res.status(401);
      res.send("Not authorized");
    } else {
      fs = require('fs');
      fs.readFile('testFile.txt', 'utf8', function (err,data) {
      //fs.readFile('/var/log/fsck_hfs.log', 'utf8', function (err,data) {
        if (err) {
          res.send(err);
        } else {
          res.send(data);
        }
        //console.log(data);
      });

      
    }
  }
});


module.exports = app