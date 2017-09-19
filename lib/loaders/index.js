'use strict'

module.exports = tryLoad

const co = require('co')

const loaders = [
    'travis'
]
    .map(loader => require(`./${loader}`))

function tryLoad(path) {
    return co(function *() {
        console.log(`searching for build configuration file...`)

        for (let loader of loaders)
            if (yield loader.canLoad(path)) {
                console.log(`${loader.name} configuration found, processing...`)

                return yield loader.tryLoad(path)
            }

        throw new Error(`no supported configuration file found in ${path}`)
    })
}
