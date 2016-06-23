#!/bin/env node
//  OpenShift sample Node application
const express       = require('express');
const compression   = require('compression');
const fs            = require('fs');
const url           = require('url');
const glob          = require('glob');

const PCMApp = function() {

    //  Scope.
    var self = this;


    /*  ================================================================  */
    /*  Helper functions.                                                 */
    /*  ================================================================  */

    /**
     *  Set up server IP address and port # using env variables/defaults.
     */
    this.setupVariables = function() {
        //  Set the environment variables we need.
        this.ipaddress = process.env.OPENSHIFT_NODEJS_IP;
        this.port      = process.env.OPENSHIFT_NODEJS_PORT || 9000;

        if (typeof this.ipaddress === "undefined") {
            //  Log errors on OpenShift but continue w/ 127.0.0.1 - this
            //  allows us to run/test the app locally.
            console.warn('No OPENSHIFT_NODEJS_IP var, using 127.0.0.1');
            this.ipaddress = "127.0.0.1";
        }
    };


    /**
     *  Populate the cache.
     */
    this.populateCache = function() {
        if (typeof this.zcache === "undefined") {
            this.zcache = { 'index.html': '' };
        }

        //  Local cache for static content.
        // self.zcache['index.html'] = fs.readFileSync('./index.html');
        // self.zcache['ascension.js'] = fs.readFileSync('./ascension.js');
        // self.zcache['ascension.css'] = fs.readFileSync('./ascension.css');
        // self.zcache['favicon.png'] = fs.readFileSync('./app/assets/img/favicon.png');
        //
        // glob.sync("*.png").forEach(function(f) {
        //     self.zcache[f] = fs.readFileSync('./' + f);
        // });

    };


    /**
     *  Retrieve entry (content) from cache.
     *  @param {string} key  Key identifying content to retrieve from cache.
     */
    this.cache_get = function(key) { return this.zcache[key]; };


    /**
     *  terminator === the termination handler
     *  Terminate server on receipt of the specified signal.
     *  @param {string} sig  Signal to terminate on.
     */
    this.terminator = function(sig){
        if (typeof sig === "string") {
            console.log('%s: Received %s - terminating sample app ...',
                Date(Date.now()), sig);
            process.exit(1);
        }
        console.log('%s: Node server stopped.', Date(Date.now()) );
    };


    /**
     *  Setup termination handlers (for exit and a list of signals).
     */
    this.setupTerminationHandlers = function(){
        //  Process on exit and signals.
        process.on('exit', () => this.terminator() );

        // Removed 'SIGPIPE' from the list - bugz 852598.
        ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
            'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
        ].forEach((element, index, array) => {
            process.on(element, () => this.terminator(element) );
        });
    };


    /*  ================================================================  */
    /*  App server functions (main app logic here).                       */
    /*  ================================================================  */

    /**
     *  Create the routing table entries + handlers for the application.
     */
    this.createRoutes = function() {
        this.routes = { };

        // self.routes['/'] = function(req, res) {
        //     res.setHeader('Content-Type', 'text/html');
        //     res.setHeader('Cache-Control', 'public, max-age=900, s-maxage=1209600');
        //     res.send(self.cache_get('index.html') );
        // };
        // self.routes['/internal/'] = function(req, res) {
        //     res.setHeader('Content-Type', 'text/html');
        //     res.setHeader('Cache-Control', 'public, max-age=900, s-maxage=1209600');
        //     res.send(self.cache_get('index.html') );
        // };
        //
        // self.routes['/ascension.js'] = function(req, res) {
        //     res.setHeader('Content-Type', 'application/javascript');
        //     res.setHeader('Cache-Control', 'public, max-age=900, s-maxage=31557600');
        //     res.send(self.cache_get('ascension.js') );
        // };
        // self.routes['/internal/ascension.js'] = function(req, res) {
        //     res.setHeader('Content-Type', 'application/javascript');
        //     res.setHeader('Cache-Control', 'public, max-age=900, s-maxage=31557600');
        //     res.send(self.cache_get('ascension.js') );
        // };
        //
        // self.routes['/ascension.css'] = function(req, res) {
        //     res.setHeader('Content-Type', 'text/css');
        //     res.setHeader('Cache-Control', 'public, max-age=900, s-maxage=31557600');
        //     res.send(self.cache_get('ascension.css') );
        // };
        // self.routes['/internal/ascension.css'] = function(req, res) {
        //     res.setHeader('Content-Type', 'text/css');
        //     res.setHeader('Cache-Control', 'public, max-age=900, s-maxage=31557600');
        //     res.send(self.cache_get('ascension.css') );
        // };
        //
        // glob.sync("*.png").forEach(function(f) {
        //     self.routes['/' + f] = function(req, res) {
        //         res.setHeader('Content-Type', 'image/png');
        //         res.setHeader('Cache-Control', 'public, max-age=900, s-maxage=31557600');
        //         res.send(self.cache_get(f) );
        //     };
        //     self.routes['/internal/' + f] = function(req, res) {
        //         res.setHeader('Content-Type', 'image/png');
        //         res.setHeader('Cache-Control', 'public, max-age=900, s-maxage=31557600');
        //         res.send(self.cache_get(f) );
        //     };
        // });

        // self.routes['/*'] = function(req, res) {
        //     var tmpUrl = url.parse(req.url);
        //     var route = '/support/cases/internal/#/ascension' + tmpUrl.pathname;

        //     if(route.charAt(route.length -1) === "/"){
        //         route = route.substring(0, route.length -1);
        //     }
        //     if(tmpUrl.search !== null){
        //         route = route + tmpUrl.search;
        //     }
        //     res.writeHead(302, {
        //       'Location': route
        //     });
        //     res.end();
        // };
    };


    /**
     *  Initialize the server (express) and create the routes and register
     *  the handlers.
     */
    this.initializeServer = function() {
        this.createRoutes();
        this.app         = express();
        this.server      = require('http').Server(this.app);
        // this.app = express.createServer();
        this.app.use(compression());

        var oneDay = 86400000;
        var staticOptions = {
            maxAge: oneDay
        };

        this.app.use('/support/cases', express.static(__dirname + '/dist', staticOptions));
        this.app.use('/', express.static(__dirname + '/dist', staticOptions));

        //  Add handlers for the app (from the routes).
        // for (var r in this.routes) {
        //     this.app.get(r, this.routes[r]);
        // }
    };


    /**
     *  Initializes the sample application.
     */
    this.initialize = function() {
        this.setupVariables();
        this.populateCache();
        this.setupTerminationHandlers();

        // Create the express server and routes.
        this.initializeServer();
    };


    /**
     *  Start the server (starts up the sample application).
     */
    this.start = function() {
        //  Start the app on the specific interface (and port).
        this.app.listen(this.port, this.ipaddress, () => {
            console.log('%s: Node server started on %s:%d ...',
                Date(Date.now() ), this.ipaddress, this.port);
        });
    };

};


var zapp = new PCMApp();
zapp.initialize();
zapp.start();

