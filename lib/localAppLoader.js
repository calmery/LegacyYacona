const getAppPath = require( './getAppPath' ),
      status     = require( './status' )

const moduleLoader = require( './moduleLoader' )
const utility      = moduleLoader( 'utility' )
const file         = moduleLoader( 'file' )

const localAppLoader = ( manager, path ) => {
 
    let absolutePath = utility.fixPath( path )

    let appName = absolutePath.split( /[\/|\\]/ ).pop()
    
    if( utility.isExist( absolutePath ) === false ) return status.error( path, 'APP_DOES_NOT_EXIST' )

    let Yacona = require( '.' )
    let yaconaInstance = new Yacona( absolutePath, appName )  
    
    yaconaInstance.currentDirectory = path

    let packageJson    

    let packageJsonPath = utility.fixPath( absolutePath, 'package.json' )
    if( utility.isExist( packageJsonPath ) === true ) packageJson = JSON.parse( file.readFileSync( packageJsonPath ) )

    let main = utility.fixPath( absolutePath, ( ( packageJson === undefined || packageJson.main === undefined ) ? 'index' : packageJson.main ) )
    
    yaconaInstance.self = manager.add( appName, yaconaInstance )

    let fn = require( main )
    if( typeof fn === 'function' ) fn( yaconaInstance )

    return status.complete()
    
}

module.exports = localAppLoader