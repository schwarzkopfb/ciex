'use strict'

module.exports = runWithVersion

const TEMP_DIR_NAME = '.ciex'

const COPY_OPTS = {
    deleteFirst: false,
    overwrite: true,
    confirm: true,
    filter: name => !~name.indexOf('node_modules') && !~name.indexOf(TEMP_DIR_NAME)
}

const join  = require('path').join,
      spawn = require('child_process').spawn,
      mkdir = require('mkdirp'),
      cpr   = require('cpr'),
      co    = require('co'),
      nave  = join(__dirname, '..', 'node_modules', '.bin', 'nave')

function createProcess(path, version, env, command) {
    return new Promise((done, error) => {
        const process = spawn(nave, [ 'use', version ].concat(command), { stdio: 'inherit', cwd: path, env: env })

        process.on('error', error)
        process.on('close', done)
    })
}

function createDirectory(path) {
    return new Promise((done, error) => {
        mkdir(path, err => err ? error(err) : done())
    })
}

function copy(src, dest) {
    return new Promise((done, error) => {
        cpr(src, dest, COPY_OPTS, err => err ? error(err) : done())
    })
}

function runWithVersion(path, config) {
    return co(function *() {
        const ver = config.version,
              env = Object.assign(process.env, config.env, {}),
              dir = join(path, TEMP_DIR_NAME, `v${ver}`)

        yield createDirectory(join(dir, 'node_modules'))
        yield copy(path, dir)

        try {
            yield createProcess(dir, ver, env, config.install)
        }
        catch(ex) {
            console.error(`unable to execute '${config.install}' with node version ${ver}`)
            console.error()

            throw ex
        }

        try {
            return yield createProcess(dir, ver, env, config.script)
        }
        catch(ex) {
            console.error(`unable to execute '${config.script}' with node version ${ver}`)
            console.error()

            throw ex
        }
    })
}
