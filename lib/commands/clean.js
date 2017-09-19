'use strict'

module.exports = clean

const path    = require('path'),
      resolve = path.resolve,
      join    = path.join,
      rm      = require('rimraf')

function clean(path) {
    path = resolve(join(path || process.cwd(), '.ciex'))

    return new Promise((done, error) => rm(path, err => err ? error(err) : done()))
}
