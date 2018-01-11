const https = require('https');
const fs = require('fs');
const path = require('path');
const Express = require('express');
const compression = require('compression');
const serveStatic = require('serve-static');
const morgan = require('morgan');
const history = require('connect-history-api-fallback');

const app = new Express();

const publicDir = 'public';
const defaultPage = 'index.html';

const port = 8443;

function setCustomCacheControl(res, path) {
    if (serveStatic.mime.lookup(path) === 'text/html') {
        res.setHeader('Cache-Control', 'public, max-age=600')
    }
}

app
    .use(morgan('combined'))
    .use(compression())
    .use('/live', function (req, res) {
        res.send('<h1>Application is alive :)</h1>');
    })
    .use(history())
    .use(history({
        rewrites: [{
            from: /^\/support\/cases\/(.*)/i,
            to: function (context) {
                return '/' + context.match[1];
            },
        }],
    }))
    .use(serveStatic(path.join(__dirname, publicDir), {
        maxAge: '10d',
        setHeaders: setCustomCacheControl,
    }));

try {
    const cert = fs.readFileSync('/etc/ssl/server.crt');
    const key = fs.readFileSync('/etc/ssl/server.key');

    const options = {
        cert,
        key,
    }

    https.createServer(options, app).listen(port, function() {
        console.log('Application start with https');
    });
} catch (err) {
    console.error(err);
    app.listen(port, function() {
        console.log('Application start with http');
    })
}
