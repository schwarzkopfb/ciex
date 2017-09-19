'use strict'

const CONFIG_FILE_NAME    = '.travis.yml',
      YARN_LOCK_FILE_NAME = 'yarn.lock'

const fs     = require('fs'),
      assert = require('assert'),
      join   = require('path').join,
      co     = require('co'),
      YAML   = require('yamljs'),
      varsOf = require('../utils/parse-vars')

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

function parseEnvs(def) {
    const result = [],
          base   = {}

    if (!def)
        return [ {} ]

    if (def.global || def.matrix) {
        assert(def.global && def.matrix, '`global` and `matrix` are both required under `env`')

        for (let line of def.global) {
            const parsed = varsOf(line)

            assert.equal(Object.keys(parsed).length, 1, 'only one variable per line is allowed under `env.global`')

            Object.assign(base, parsed)
        }

        parseVars(def.matrix, true)
    }
    else
        parseVars(def)

    function parseVars(lines, matrix) {
        const parsed = lines.map(varsOf)

        /*
         * from Travis docs:
         *
         * "When you define multiple variables per line in the env array (matrix variables), one build is triggered per item."
         *
         * ...so we need to create one env object for each line
         */
        if (matrix || parsed.find(vars => Object.keys(vars).length > 1))
            parsed.forEach(vars =>
                result.push(Object.assign(vars, base)))
        // otherwise we need to merge all the listed variables into one env object
        else
            result.push(
                Object.assign(
                    parsed.reduce((vars, _var) => Object.assign(vars, _var), {}), base
                )
            )
    }

    return result
}

function startupMessage(vs, es, ic, mc) {
    const vc = vs.length,
          ec = es.length

    let msg = `starting build`

    if (vc > 1 || ec > 1)
        msg += 's'

    msg += ` with ${vc} Node.js version`

    if (vc > 1)
        msg += 's'

    msg += ` in ${ec} `

    if (ec > 1)
        msg += 'different '

    msg += 'environment'

    if (ec > 1)
        msg += 's'

    msg += '...'

    console.log(msg)
    console.log(`install command: '${ic.join(' ')}'`)
    console.log(`main command:    '${mc.join(' ')}'`)
}

function tryLoad(path) {
    return co(function *() {
        const data   = YAML.parse(yield read(path)),
              result = []

        assert.equal(data.language, 'node_js', 'only Node.js is supported')
        assert(Array.isArray(data.node_js), 'no version list provided')

        let envs     = parseEnvs(data.env),
            script   = data.script,
            install  = [ 'npm', 'install' ],
            versions = data.node_js

        if (script)
            script = script.trim().split(/\s+/)
        else
            script = [ 'npm', 'test' ]

        if (yield access(join(path, YARN_LOCK_FILE_NAME)))
            install = [ 'yarn' ]

        for (let version of versions)
            for (let env of envs)
                result.push({
                    version: version,
                    install: install,
                    script: script,
                    env: env
                })

        startupMessage(versions, envs, install, script)

        return result
    })
}

module.exports = {
    name: 'Travis',
    canLoad: canLoad,
    tryLoad: tryLoad
}
