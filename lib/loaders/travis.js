'use strict'

const join   = require('path').join,
      YAML   = require('yamljs'),
      Loader = require('./base')

module.exports = new Loader('Travis', '.travis.yml', tryLoad)

function tryLoad(path) {
    return new Promise((ok, error) => {
        const data = YAML.load(join(path, this.fileName))

        if (data.language !== 'node_js')
            error(new Error('only Node.js is supported'))
        else if (!Array.isArray(data.node_js))
            error(new Error('no version list provided'))
        else {
            const result = []
            let env = data.env || null

            if (env)
                env = env.reduce((env, pair) => {
                    const tmp = pair.split('=')

                    env[ tmp[ 0 ] ] = tmp[ 1 ]

                    return env
                }, {})
            else
                env = {}

            let script = data.script

            if (script)
                script = script.trim().split(/\s+/)
            else
                script = [ 'npm', 'test' ]

            for (let version of data.node_js)
                result.push({
                    version: version,
                    script: script,
                    env: env
                })

            ok(result)
        }
    })
}
