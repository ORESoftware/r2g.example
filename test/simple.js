#!/usr/bin/env node

// core
const cp = require('child_process');
const path = require('path');
const fs = require('fs');
const http = require('http');
const assert = require('assert');
const EE = require('events');
const strm = require('stream');

// npm
const chalk = require('chalk');

// local / project
const example = require('../dist');
// const example = require('r2g.example');

console.log(
  'Directory path which contains the r2g.example index file:',
  chalk.magentaBright(example.getDirName())
);
