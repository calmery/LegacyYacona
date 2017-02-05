const path = require( 'path' )

// Create a new path from arguments.
const fixPath = ( ...args ) => path.resolve( path.join.apply( this, args ) )

module.exports = fixPath