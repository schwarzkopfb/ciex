#!/usr/bin/env node

'use strict'

const resolve = require('path').resolve,
      co      = require('co'),
      run     = require('./run'),
      header  = require('./header'),
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

        for (let conf of yield tryLoad(path)) {
            header(`executing 'npm test' with node version ${conf.version}`)

            const code = yield run(path, conf.version, conf.env, conf.script)

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
        console.error(err.message || err.stack || err)
        console.error()
    })
