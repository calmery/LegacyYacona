const yaml = require( 'js-yaml' )

const dump = content => yaml.safeDump( content )

module.exports = dump