#!/usr/bin/env node

'use strict'

const KNOWN_ARGS = {
    help: Boolean
}

const SHORTHANDS = {
    h:  [ '--help' ]
}

const commands = require('./commands'),
      args     = require('nopt')(KNOWN_ARGS, SHORTHANDS).argv,
      command  = args.remain[ 0 ]

if (args.help)
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
