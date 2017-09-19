'use strict'

module.exports = parseVars

/*
 * parser states:
 *
 * 0) searching for key
 * 1) reading key
 * 2) starting value
 * 3) value starting with "
 * 4) value starting with '
 * 5) value without " or '
 */
function parseVars(str) {
    const result = {}

    let key   = '',
        value = '',
        state = 0

    function save() {
        result[ key ] = value

        key   = ''
        value = ''
        state = 0
    }

    for (let ch of str) {
        switch (state) {
            case 0:
                if (ch !== ' ') {
                    key += ch
                    state = 1
                }
                break

            case 1:
                if (ch !== '=')
                    key += ch
                else
                    state = 2
                break

            case 2:
                if (ch === '"')
                    state = 3
                else if (ch === "'")
                    state = 4
                else {
                    state = 5
                    value += ch
                }
                break

            case 3:
                if (ch === '"')
                    save()
                else
                    value += ch
                break

            case 4:
                if (ch === "'")
                    save()
                else
                    value += ch
                break

            case 5:
                if (ch === ' ')
                    save()
                else
                    value += ch
                break
        }
    }

    if (key)
        save()

    return result
}
