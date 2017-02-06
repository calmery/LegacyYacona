const fs = require( 'fs' )
const path = require( 'path' )

const fixPath = ( ...args ) => path.resolve( path.join.apply( this, args ) )

const unlinkSync = ( file ) => {
    let url = fixPath( file )
    return fs.unlinkSync( url )
}

module.exports = unlinkSync