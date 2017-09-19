#!/usr/bin/env node

'use strict'

const resolve = require('path').resolve,
      co      = require('co'),
      run     = require('./utils/run'),
      header  = require('./utils/header'),
      tryLoad = require('./loaders'),
      failed  = []

let path = process.argv[ 2 ]

if (!path) {
    console.log()
    console.log('usage: ciex <path_to_project_directory>')
    console.log()
    console.log('note: currently only Travis (.travis.yml) configuration files are supported')
    console.log()
}
else
    co(function *() {
        path = resolve(path)

        console.log()
        console.log(`ciex@${require('../package.json').version} ${path}`)
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
    })
    .catch(err => {
        console.error()

        const debug = process.env.DEBUG

        if (debug && ~debug.indexOf('ciex'))
            console.error(err.stack)
        else
            console.error(err.message)

        console.error()
    })
