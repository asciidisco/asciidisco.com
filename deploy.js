var colors = require('colors');
var spawn = require('child_process').spawn;
var exec = require('child_process').exec;
var out = '', err = '';

// remote host
var host = 'asdisco@asdisco.cygnus.uberspace.de';
// blog service
var service = 'ghost';
// blog path
var destination = 'blog'

// move current to last
function preserve (cb) {
  console.log('\nSaving current instance:'.green.underline + '\n');
  out = '', err = '';
  var preserveCmd = 'cp -r ~/blog/current/* ~/blog/last/';
  var preserveCb = function (out, err, code) { if (out.length) { console.log(out); } if (err.length) { console.log(err); } if (cb) { cb(); }};
  var preserve = spawn('ssh', [host, preserveCmd]);
  console.log('    ->'.white + '  $ ssh '.yellow + host.yellow + ' ' + preserveCmd.yellow);
  preserve.stdout.on('data', function (data) { out += data });
  preserve.stderr.on('data', function (data) { err += data });
  preserve.on('exit', preserveCb.bind(this, out, err));
  preserve.stdin.end();
}

// sync that files
function sync (cb) {
  console.log('\nSyncing files:'.green.underline + '\n');
  var rsyncCmd = '-avz --exclude="*env.js*" --exclude="*Gruntfile.js*" --exclude="*config.js*" --exclude="content/images*" --exclude="content/data*" --exclude="*README*" --exclude="*node_modules*" --exclude=".git*" --exclude="*LICENSE*" --exclude="*deploy.js*" --exclude=".gitignore*" --exclude=".DS_Store*" ' + __dirname + '/ ' + host + ':/home/asdisco/' + destination + '/current';
  var rsyncCb = function (err, data) { if (data) { console.log('    ->'.white + '  ' + data.replace(/\r?\n|\r/g, '').yellow) } if (cb) { cb(); }};
  console.log('    ->'.white + '  $ rsync '.yellow + rsyncCmd.yellow);  
  var rsync = exec('rsync ' + rsyncCmd, [], rsyncCb);
}

// symlink the shared folders
function symlink (cb) {
  console.log('\nCreating shared symlinks:'.green.underline + '\n');
  out = '', err = '';
  var symlinkCmd = 'ln -s ~/blog/shared/env.js ~/blog/current/env.js && ln -s ~/blog/shared/config.js ~/blog/current/config.js && ln -s ~/blog/shared/images ~/blog/current/content/images && ln -s ~/blog/shared/data ~/blog/current/content/data';
  var symlinkCb = function (out, err, code) { if (out.length) { console.log(out); } if (err.length) { console.log(err); } if (cb) { cb(); }};
  var symlink = spawn('ssh', [host, symlinkCmd]);
  console.log('    ->'.white + '  $ ssh '.yellow + host.yellow + ' ' + symlinkCmd.yellow);
  symlink.stdout.on('data', function (data) { out += data });
  symlink.stderr.on('data', function (data) { err += data });
  symlink.on('exit', symlinkCb.bind(this, out, err));
  symlink.stdin.end();
}

// install node_modules
function npminstall (cb) {
  console.log('\nInstalling dependencies:'.green.underline + '\n');
  out = '', err = '';
  var installCmd = 'cd ~/blog/current && npm install --production';
  var installCb = function (out, err, code) { if (out.length) { console.log(out); } if (err.length) { console.log(err); } if (cb) { cb(); }};
  var install = spawn('ssh', [host, installCmd]);
  console.log('    ->'.white + '  $ ssh '.yellow + host.yellow + ' ' + installCmd.yellow);
  install.stdout.on('data', function (data) { out += data });
  install.stderr.on('data', function (data) { err += data });
  install.on('exit', installCb.bind(this, out, err));
  install.stdin.end();  
}

// restart the blog service
function restart (type, cb) {
  console.log('\nRestarting server:'.green.underline + '\n');
  out = '', err = '';
  var restartCmd = 'rm ~/ghost && ln -s ~/blog/' + type + ' ~/ghost && svc -d ~/service/' + service + ' && svc -u ~/service/' + service;
  var restartCb = function (out, err, code) { if (out.length) { console.log(out); } if (err.length) { console.log(err); } if (cb) { cb(); }};
  var restart = spawn('ssh', [host, restartCmd]);
  console.log('    ->'.white + '  $ ssh '.yellow + host.yellow + ' ' + restartCmd.yellow);
  restart.stdout.on('data', function (data) { out += data });
  restart.stderr.on('data', function (data) { err += data });
  restart.on('exit', restartCb.bind(this, out, err));
  restart.stdin.end();
}

// execute the deploy command
function deploy () {
  preserve(
    sync.bind(this,
      symlink.bind(this,
        npminstall.bind(this,
          restart.bind(this, 'current', 
            console.log.bind(console, '\nAll done, thanks for watching!')
          )
        )
      )
    )
  );
}

// execute the rollback command
function rollback () {
  restart('last',
    console.log.bind(console, '\nAll done, thanks for watching!')
  );
}

// execute the forward command
function forward () {
  restart('current',
    console.log.bind(console, '\nAll done, thanks for watching!')
  );
}

// check what to do
if (process.argv[2] === 'rollback') {
  rollback();
} else if (process.argv[2] === 'deploy') {
  deploy();
} else if (process.argv[2] === 'forward') {
  forward();
} else {
  console.log('I don´t know the command!')
}