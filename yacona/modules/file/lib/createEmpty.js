const fs = require( 'fs' )
const path = require( 'path' )

const fixPath = ( ...args ) => path.resolve( path.join.apply( this, args ) )

const createEmpty = ( file ) => {
    let url = fixPath( file )
    return fs.closeSync( fs.openSync( url, 'w' ) )
}

module.exports = createEmpty