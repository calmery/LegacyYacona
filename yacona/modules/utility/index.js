const localFunctions = [ 'fixPath', 'isExist' ]

let fn = {}
localFunctions.forEach( ( name, index ) => fn[name] = require( './lib/' + name ) )

module.exports = fn