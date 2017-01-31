const localFunctions = [ 'readFile', 'readFileSync', 'writeFile', 'writeFileSync' ]

let fn = {}

localFunctions.forEach( ( name, index ) => fn[name] = require( './' + name ) )

module.exports = fn