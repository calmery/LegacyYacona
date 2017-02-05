const path = require( 'path' )

const fixPath   = ( ...args ) => path.resolve( path.join.apply( this, args ) )
const getAppPath = ( appName ) => {
    let absolutePath = fixPath( __dirname, '..', 'applications', appName )
    return absolutePath
}

module.exports = getAppPath