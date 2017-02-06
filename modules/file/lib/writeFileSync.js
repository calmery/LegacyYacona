const fs = require( 'fs' )
const path = require( 'path' )

const fixPath = ( ...args ) => path.resolve( path.join.apply( this, args ) )

const writeFileSync = ( filePath, output ) => {
    let url = fixPath( filePath )
    return fs.writeFileSync( url, output, { encoding: 'utf-8' } )
}

module.exports = writeFileSync