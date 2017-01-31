const fs = require( 'fs' )
const fixPath = require( '../Utility/fixPath' )
      
const readFile = ( file, fn ) => {
    let url = fixPath( file )
    return fs.readFile( url, { encoding: 'utf-8' }, fn )
}

module.exports = readFile