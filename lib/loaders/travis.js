'use strict'

const CONFIG_FILE_NAME    = '.travis.yml',
      YARN_LOCK_FILE_NAME = 'yarn.lock'

const fs     = require('fs'),
      join   = require('path').join,
      co     = require('co'),
      YAML   = require('yamljs')

function access(path) {
    return new Promise(done => fs.access(path, err => err ? done(false) : done(true)))
}

function read(path) {
    return new Promise(
        (done, error) => fs.readFile(
            join(path, CONFIG_FILE_NAME), 'utf8', (err, content) => err ? error(err) : done(content)
        )
    )
}

function canLoad(path) {
    return access(join(path, CONFIG_FILE_NAME))
}

function tryLoad(path) {
    return co(function *(ok, error) {
        const data = YAML.parse(yield read(path))

        if (data.language !== 'node_js')
            error(new Error('only Node.js is supported'))
        else if (!Array.isArray(data.node_js))
            error(new Error('no version list provided'))
        else {
            const result = []

            let env     = data.env || null,
                script  = data.script,
                install = [ 'npm', 'install' ]

            if (env)
                env = env.reduce((env, pair) => {
                    const tmp = pair.split('=')

                    env[ tmp[ 0 ] ] = tmp[ 1 ]

                    return env
                }, {})
            else
                env = {}

            if (script)
                script = script.trim().split(/\s+/)
            else
                script = [ 'npm', 'test' ]

            if (yield access(join(path, YARN_LOCK_FILE_NAME)))
                install = [ 'yarn' ]

            for (let version of data.node_js)
                result.push({
                    version: version,
                    install: install,
                    script: script,
                    env: env
                })

            return result
        }
    })
}

module.exports = {
    name: 'Travis',
    canLoad: canLoad,
    tryLoad: tryLoad
}
