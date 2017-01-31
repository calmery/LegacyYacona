const localFunctions = [ 'startUp', 'addRoute' ]

let fn = {}

localFunctions.forEach( ( name, index ) => fn[name] = require( './' + name ) )

module.exports = fn