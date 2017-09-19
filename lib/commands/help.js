'use strict'

module.exports = printHelp

const commands = require('./commands')

function printHelp() {
    console.log()
    console.log('Usage: ciex <command>')
    console.log()
    console.log('where <command> is one of:')
    console.log(`    ${commands.map(c => c.name).join(', ')}`)

    commands.forEach(command => {
        console.log()
        console.log(`ciex ${command.name} ${command.params || ''}`)
        console.log(`    ${command.description || ''}`)
    })

    console.log()

    return Promise.resolve()
}
