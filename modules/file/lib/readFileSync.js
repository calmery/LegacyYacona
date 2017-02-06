const fs = require( 'fs' )
const path = require( 'path' )

const fixPath = ( ...args ) => path.resolve( path.join.apply( this, args ) )

const readFileSync = ( file ) => {
    let url = fixPath( file )
    return fs.readFileSync( url, { encoding: 'utf-8' } )
}

module.exports = readFileSync