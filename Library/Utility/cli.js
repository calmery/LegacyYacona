const localFunctions = [ 'fixPath', 'getLocalAddress', 'isExist' ]

let fn = {}

localFunctions.forEach( ( name, index ) => fn[name] = require( './' + name ) )

module.exports = fn