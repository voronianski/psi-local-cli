#!/usr/bin/env node

const ngrok = require('ngrok');
const yargs = require('yargs');
const ora = require('ora');
const exec = require('child_process').exec;

const opts = yargs.default({
  strategy: 'desktop',
  nokey: true
}).argv;

if (opts.help) {
  return exec('psi --help', (err, stdout) => {
    stdout = stdout
      .replace(/psi/gm, 'psi-local')
      .replace('<url>', '--port <localhost port>')
      .replace('todomvc.com', '--port 8080');

    process.stdout.write(stdout);
  });
}

if (!opts.port) {
  return error({
    message: '--port option is required',
    noStack: true
  });
}

const spinner = ora({color: 'yellow'});

spinner.start();
spinner.text = '---> Creating ngrok tunnel';

ngrok.connect(opts.port, (err, url) => {
  if (err) {
    return error(err)
  }

  if (opts.route) {
    url += opts.route
  }

  spinner.text = `---> PageSpeed Insights will run for: ${url}`;

  if (opts.nopsi) {
    return;
  }

  exec(`psi ${url} ${_createPsiParams(opts)}`, (err, stdout) => {
    spinner.text = '---> PageSpeed Insights are done!';
    spinner.stop();

    process.stdout.write(`\n${stdout}`);
    process.exit();
  });
});

function _createPsiParams (obj) {
  const params = Object.assign({}, obj, {
    port: 0,
    route: 0,
    nopsi: 0
  });

  return Object.keys(params)
    .filter(key => params[key])
    .reduce((memo, key)  => {
      memo += ` --${key} ${params[key]}`;
      return memo;
    }, '');
}

function _error (err) {
  if (err.noStack) {
    console.error(err.message);
    process.exit(1);
  } else {
    throw err;
  }
}
