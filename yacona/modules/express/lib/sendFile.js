const path = require( 'path' )

const fixPath  = ( ...args ) => path.resolve( path.join.apply( this, args ) )
const sendFile = ( file ) => ( request, response ) => response.sendFile( fixPath( file ) )

module.exports = sendFile