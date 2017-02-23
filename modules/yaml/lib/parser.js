const yaml = require( 'js-yaml' )

const parser = ( content ) => yaml.safeLoad( content )

module.exports = parser