#!/usr/bin/env node

'use strict'

const KNOWN_ARGS = {
    help: Boolean,
    version: Boolean
}

const SHORTHANDS = {
    h: [ '--help' ],
    v: [ '--version' ]
}

const commands = require('./commands'),
      args     = require('nopt')(KNOWN_ARGS, SHORTHANDS),
      version  = require('../package.json').version,
      command  = args.argv.remain[ 0 ]

if (args.version)
    console.log(version)
else if (args.help)
    commands.help()
else if (command in commands)
    commands[ command ]
        .apply(null, args.remain.slice(1))
        .catch(err => {
            console.error()

            const debug = process.env.DEBUG

            if (debug && ~debug.indexOf('ciex'))
                console.error(err.stack)
            else
                console.error(err.message)

            console.error()
        })
else
    commands.help()
