const localFunctions = [ 'readFileSync', 'readdirSync', 'writeFileSync', 'unlinkSync', 'rmdirSync', 'createEmpty', 'mkdirSync' ]

let fn = {}
localFunctions.forEach( ( name, index ) => fn[name] = require( './lib/' + name ) )

module.exports = fn