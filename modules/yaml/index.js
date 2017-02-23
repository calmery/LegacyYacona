const localFunctions = [ 'save', 'load', 'parser', 'loader' ]

let fn = {}
localFunctions.forEach( ( name, index ) => fn[name] = require( './lib/' + name ) )

module.exports = fn