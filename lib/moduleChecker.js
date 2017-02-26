const path = require( 'path' ),
      fs   = require( 'fs' )

const fixPath = ( ...args ) => path.resolve( path.join.apply( this, args ) )
const isExist = ( file ) =>{
    try {
        fs.statSync( path.resolve( file ) )
        return true
    } catch( error ){
        return false
    }
}

const moduleChecker = ( moduleName ) => {
    let absolutePath = fixPath( __dirname, '..', 'modules', moduleName )
    return isExist( absolutePath )
}

module.exports = moduleChecker