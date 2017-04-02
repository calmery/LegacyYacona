const status = require( './status' )
const moduleLoader = require( './moduleLoader' )

const utility = moduleLoader( 'utility' )
const file = moduleLoader( 'file' )

const save = ( path, name, value ) => {
    if( name.indexOf( '..' ) !== -1 ) return status.error( 'Config save', 'PATH_CANNOT_BE_USED' )
    
    if( utility.isExist( path ) === false ) file.mkdirSync( path )
    
    let dir = name.split( /[\/|\\]/ )
    let checked = []
    let p
    for( let i=0; i<dir.length-1; i++ ){
        p = utility.fixPath( path, checked.join( '/' ), dir[i] )
        if( utility.isExist( p ) === false ) file.mkdirSync( p )
        checked.push( dir[i] )
    }
    
    if( utility.isExist( path ) === false ) file.mkdirSync( path )
    file.writeFileSync( utility.fixPath( path, name ), value )
    return status.complete()
}

const load = ( path, appName, name ) => {
    let share = true

    if( name === undefined ){
        name = appName
        share = false
    }

    let fullPath = utility.fixPath( path, name )
    if( share ) fullPath = utility.fixPath( path, '..', appName, name )
    
    if( utility.isExist( fullPath ) === true ) return file.readFileSync( fullPath )
    return status.error( 'Config load', 'FILE_NOT_FOUND' )
}

module.exports.save = save
module.exports.load = load