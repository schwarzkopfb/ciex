'use strict'

module.exports = header

function header(text) {
    let str  = '',
        cols = process.stdout.columns,
        n    = Math.floor(cols / 2 - text.length / 2) - 2

    if (n < 0)
        n = 0

    for (let i = n; i--;)
        str += '-'

    str += `| ${text} |`

    for (let i = n; i--;)
        str += '-'

    // when n is rounded
    if (2 * n + text.length + 4 < cols)
        str += '-'

    console.log()
    console.log(str)
    console.log()
}
