const fs = require( 'fs' )
const path = require( 'path' )

const fixPath = ( ...args ) => path.resolve( path.join.apply( this, args ) )

const mkdir = ( dir ) => {
    return fs.mkdirSync( fixPath( dir ) )
}

module.exports = mkdir