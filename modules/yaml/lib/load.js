const fs = require( 'fs' )
const parser = require( './parser' )

const load = ( path ) => fs.readFileSync( path, 'utf8' )

module.exports = load