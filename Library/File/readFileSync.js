const fs = require( 'fs' )
const fixPath = require( '../Utility/fixPath' )

const readFileSync = ( file ) => {
    let url = fixPath( file )
    return fs.readFileSync( url, { encoding: 'utf-8' } )
}

module.exports = readFileSync