const getAppPath = require( './getAppPath' ),
      status     = require( './status' )

const moduleLoader = require( './moduleLoader' )
const utility      = moduleLoader( 'utility' )
const file         = moduleLoader( 'file' )

const appLoader = ( appName ) => {
    let appPath = getAppPath( appName )

    if( utility.isExist( appPath ) === false ) 
        return status.error( appName, 'APP_DOES_NOT_EXIST' )

    let Yacona = require( '.' )
    let yaconaInstance = new Yacona( appPath, appName )    
    
    let packageJson    

    let packageJsonPath = utility.fixPath( appPath, 'package.json' )
    if( utility.isExist( packageJsonPath ) === true )
        packageJson = JSON.parse( file.readFileSync( packageJsonPath ) )

    let main = utility.fixPath( appPath, ( ( packageJson === undefined || packageJson.main === undefined ) ? 'index' : packageJson.main ) )

    let fn = require( main )
    if( typeof fn === 'function' ) fn( yaconaInstance )

    let statusComp = status.complete()
    statusComp.instance = yaconaInstance
    
    return statusComp
}

module.exports = appLoader