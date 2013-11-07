// # Ghost Configuration
// Setup your Ghost install for various environments

var path = require('path'),
    fs = require('fs'),
    config;

// check if we have a passcode file for our mail server
var config = {mail: {}};
try {
  config = require(__dirname + '/env.js');
} catch (e) {}

config = {
    // ### Development **(default)**
    development: {
        url: 'http://localhost:3000',
        mail: {},
        database: {
            client: 'sqlite3',
            connection: {
                filename: fs.realpathSync('./content/data/ghost-dev.db')
            },
            debug: false
        },
        server: {
            host: '127.0.0.1',
            port: '3000'
        },
        mail: {
            fromaddress: 'dev@asciidisco.com',
            transport: 'SMTP',
            options: {
                service: 'Mailgun',
                auth: {
                    user: 'postmaster@asciidisco.mailgun.org',
                    pass: config.mail.pass
                 }
            }
        }
    },

    // ### Production
    // When running Ghost in the wild, use the production environment
    // Configure your URL and mail settings here
    production: {
        url: 'http://asdisco.cygnus.uberspace.de',
        mail: {},
        database: {
            client: 'sqlite3',
            connection: {
                filename: fs.realpathSync('./content/data/ghost.db')
            },
            debug: false
        },
        server: {
            host: '127.0.0.1',
            port: '65520'
        },
        mail: {
            fromaddress: 'blog@asciidisco.com',
            transport: 'SMTP',
            options: {
                service: 'Mailgun',
                auth: {
                    user: 'postmaster@asciidisco.mailgun.org',
                    pass: config.mail.pass
                 }
            }
        }
    },

    // **Developers only need to edit below here**

    // ### Testing
    // Used when developing Ghost to run tests and check the health of Ghost
    // Uses a different port number
    testing: {
        url: 'http://127.0.0.1:2369',
        database: {
            client: 'sqlite3',
            connection: {
                filename: fs.realpathSync('./content/data/ghost.db')
            }
        },
        server: {
            host: '127.0.0.1',
            port: '2369'
        }
    },

    // ### Travis
    // Automated testing run through Github
    travis: {
        url: 'http://127.0.0.1:2368',
        database: {
            client: 'sqlite3',
            connection: {
                filename: fs.realpathSync('./content/data/ghost.db')
            }
        },
        server: {
            host: '127.0.0.1',
            port: '2368'
        }
    }
};

// Export config
module.exports = config;
