const fs = require( 'fs' )
const yaml = require( 'js-yaml' )

const save = ( path, content ) => fs.writeFileSync( path, yaml.safeDump( content ) )

module.exports = save