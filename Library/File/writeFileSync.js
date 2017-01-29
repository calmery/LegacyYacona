const fs = require( 'fs' )
const fixPath = require( '../Utility/fixPath' )

const writeFileSync = ( file, data ) => {
    let url = fixPath( file )
    return fs.writeFileSync( url, data, { encoding: 'utf-8' } )
}

module.exports = writeFileSync