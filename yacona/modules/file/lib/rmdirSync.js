const fs = require( 'fs' )
const path = require( 'path' )

const fixPath = ( ...args ) => path.resolve( path.join.apply( this, args ) )

const rmdirSync = ( file ) => {
    // http://www.geedew.com/remove-a-directory-that-is-not-empty-in-nodejs/
    let deleteFolderRecursive = ( path ) => {
        if( fs.existsSync( path ) ){
            fs.readdirSync( path ).forEach( ( file, index ) => {
                let curPath = path + '/' + file
                if( fs.lstatSync( curPath ).isDirectory() ) deleteFolderRecursive( curPath )
                else fs.unlinkSync( curPath )
            } )
            fs.rmdirSync( path )
        }
    }
    let url = fixPath( file )
    return deleteFolderRecursive( url )
}

module.exports = rmdirSync