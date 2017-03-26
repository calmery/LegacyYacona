const status = require( './status' )
const moduleLoader = require( './moduleLoader' )

const utility = moduleLoader( 'utility' )
const file = moduleLoader( 'file' )

const save = ( path, name, value ) => {
    if( name.indexOf( '..' ) !== -1 ) return status.error( 'Documents save', 'PATH_CANNOT_BE_USED' )
    if( utility.isExist( path ) === false ) file.mkdirSync( path )
    file.writeFileSync( utility.fixPath( path, name ), value )
    return status.complete()
}

const load = ( path, name ) => {
    let fullPath = utility.fixPath( path, name )
    if( utility.isExist( fullPath ) === true ) return file.readFileSync( fullPath )
    return status.error( 'Documents load', 'FILE_NOT_FOUND' )
}

module.exports.save = save
module.exports.load = load