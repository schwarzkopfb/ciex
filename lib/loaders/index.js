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
                const versions = yield loader.tryLoad(path)

                console.log()
                console.log(`${loader.name} configuration found...`)

                return versions
            }

        throw new Error(`no configuration file found in ${path}`)
    })
}
