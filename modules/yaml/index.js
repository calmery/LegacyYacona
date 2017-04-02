const localFunctions = [ 'save', 'load', 'parser', 'loader', 'dump' ]

let fn = {}
localFunctions.forEach( ( name, index ) => fn[name] = require( './lib/' + name ) )

module.exports = fn