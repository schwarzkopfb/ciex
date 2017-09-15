'use strict'

module.exports = tryLoad

const co = require('co')

const loaders = [
    'travis'
]
    .map(loader => require(`./${loader}`))

function tryLoad(path) {
    return co(function *() {
        for (let loader of loaders)
            if (yield loader.canLoad(path)) {
                const matrix = yield loader.tryLoad(path)

                console.log()
                console.log(`${loader.name} configuration found...`)

                return matrix
            }

        throw new Error(`no supported configuration file found in ${path}`)
    })
}
