const path = require( 'path' )

const fixPath      = ( ...args ) => path.resolve( path.join.apply( this, args ) )
const moduleLoader = ( moduleName ) => {
    let absolutePath = fixPath( __dirname, '..', 'modules', moduleName )
    return require( absolutePath )
}

module.exports = moduleLoader