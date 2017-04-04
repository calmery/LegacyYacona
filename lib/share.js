const status = require( './status' )
const moduleLoader = require( './moduleLoader' )

const utility = moduleLoader( 'utility' )
const file = moduleLoader( 'file' )

const save = ( path, filePath, value ) => {
    if( filePath.indexOf( '..' ) !== -1 ) return status.error( 'Save', 'PATH_CANNOT_BE_USED' )
    if( utility.isExist( path ) === false ) file.mkdirSync( path )
    
    let dir = filePath.split( /[\/|\\]/ )
    let checked = []
    let p
    for( let i=0; i<dir.length-1; i++ ){
        p = utility.fixPath( path, checked.join( '/' ), dir[i] )
        if( utility.isExist( p ) === false ) file.mkdirSync( p )
        checked.push( dir[i] )
    }
    
    file.writeFileSync( utility.fixPath( path, filePath ), value )
    return status.complete()
}

const load = ( path, filePath ) => {
    let fullPath = utility.fixPath( path, filePath )
    if( utility.isExist( fullPath ) === true ) return file.readFileSync( fullPath )
    return status.error( 'Load', 'FILE_NOT_FOUND' )
}

module.exports.save = save
module.exports.load = load