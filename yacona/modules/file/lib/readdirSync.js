const fs = require( 'fs' )
const path = require( 'path' )

const fixPath = ( ...args ) => path.resolve( path.join.apply( this, args ) )

const readdirSync = ( directory ) => {
    let url = fixPath( directory )
    return fs.readdirSync( url )
}

module.exports = readdirSync