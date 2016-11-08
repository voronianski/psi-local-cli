#!/usr/bin/env node

const ngrok = require('ngrok');
const psi = require('psi');
const output = require('psi/lib/output');
const yargs = require('yargs');
const ora = require('ora');
const exec = require('child_process').exec;

const opts = yargs.default({
  strategy: 'desktop',
  nokey: true
}).argv;

if (!opts.port) {
  return error({
    message: '--port option is required',
    noStack: true
  });
}

const spinner = ora({color: 'yellow'});

spinner.start();
spinner.text = '---> Creating ngrok tunnel';

ngrok.connect(opts.port, function (err, url) {
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

  exec(`psi ${url} ${createPsiParams(opts)}`, function (err, stdout) {
    spinner.text = '---> PageSpeed Insights are done!';
    spinner.stop();

    process.stdout.write(`\n${stdout}`);
    process.exit();
  });
});

function createPsiParams (obj) {
  const params = Object.assign({}, obj, {port: 0, route: 0, nopsi: 0});

  return Object.keys(params).filter(function (key) {
    return params[key];
  }).reduce(function (memo, key) {
    memo += ` --${key} ${params[key]}`;
    return memo;
  }, '');
}

function error (err) {
  if (err.noStack) {
    console.error(err.message);
    process.exit(1);
  } else {
    throw err;
  }
}
