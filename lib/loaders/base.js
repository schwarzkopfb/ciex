'use strict'

const join       = require('path').join,
      accessSync = require('fs').accessSync

class Loader {
    constructor(name, fileName, tryLoad) {
        this.name     = name
        this.tryLoad  = tryLoad
        this.fileName = fileName
    }

    canLoad(path) {
        return new Promise(ok => {
            try {
                accessSync(join(path, this.fileName))
                ok(true)
            }
            catch(ex) {
                ok(false)
            }
        })
    }
}

module.exports = Loader
