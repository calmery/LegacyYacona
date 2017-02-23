const load = require( './load' )
const parser = require( './parser' )

const loader = ( path ) => parser( load( path ) )

module.exports = loader