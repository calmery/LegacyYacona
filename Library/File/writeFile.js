const fs = require( 'fs' )
const fixPath = require( '../Utility/fixPath' )

const writeFile = ( file, data, fn ) => {
    let url = fixPath( file )
    return fs.writeFile( url, data, { encoding: 'utf-8' }, fn )
}

module.exports = writeFile