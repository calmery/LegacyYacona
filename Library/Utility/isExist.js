const path = require( 'path' ),
      fs   = require( 'fs' )

isExist = ( file ) =>{
    try {
        fs.statSync( path.resolve( file ) )
        return true
    } catch( error ){
        return false
    }
}

module.exports = isExist