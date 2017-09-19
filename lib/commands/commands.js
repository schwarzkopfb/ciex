'use strict'

module.exports = [
    {
        name: 'run',
        params: '[<path_to_project_folder>]',
        description:
            'Execute builds inside the specified folder (or cwd),\n    ' +
            'based on CI configuration file located in that folder.'
    },
    {
        name: 'clean',
        params: '[<path_to_project_folder>]',
        description:
            'Remove ciex\'s cache from the specified folder.\n    ' +
            'Same as executing `rm -rf <path_to_project_folder or cwd>/.ciex`.'
    },
    {
        name: 'help',
        description: 'Display this usage info.'
    }
]