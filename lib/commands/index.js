'use strict'

module.exports =
    require('./commands')
        .reduce((commands, command) => {
            const name = command.name

            commands[ name ] = require(`./${name}`)

            return commands
        }, {})
