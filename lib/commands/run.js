'use strict'

module.exports = require('co').wrap(runCommand)

const resolve = require('path').resolve,
      run     = require('../utils/run'),
      header  = require('../utils/header'),
      tryLoad = require('../loaders'),
      version = require('../../package.json').version,
      failed  = []

function *runCommand(path) {
    path = resolve(path || process.cwd())

    console.log()
    console.log(`ciex@${version} ${path}`)
    console.log()

    for (let conf of yield tryLoad(path)) {
        header(`executing '${conf.script.join(' ')}' with node version ${conf.version}`)

        const code = yield run(path, conf)

        if (code !== 0)
            failed.push(`'${conf.version}'`)
    }

    if (failed.length) {
        console.error()
        console.error(`tests are failed with the following node versions: ${failed.join(', ')}`)
        console.error()
    }
    else
        header('all the tests passed \\o/')
}
