const getAppPath = require( './getAppPath' ),
      status     = require( './status' )

const moduleLoader = require( './moduleLoader' )
const utility      = moduleLoader( 'utility' )
const file         = moduleLoader( 'file' )

const appRemover = ( appName, callback ) => {
    let appPath = getAppPath( appName )

    if( utility.isExist( appPath ) === false ){
        if( callback ) callback( status.error( appName, 'APP_DOES_NOT_EXIST' ) )
        return false
    }
    
    file.rmdirSync( appPath )
    if( callback ) callback( status.complete() )
    
    return true
}

module.exports = appRemover