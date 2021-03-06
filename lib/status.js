const error = ( appName, errorCode ) => {
    const messages = {
        'APP_DOES_NOT_EXIST': appName + ' doesn\'t exist',
        'TAP_UNKNOWN_REPO': 'Repository is unknown',
        'TAP_PULL_FAILED': 'Git pull command failed',
        'TAP_CLONE_FAILED': 'Git clone command failed',
        'APP_ALREADY_INSTALLED': 'The Application is already installed',
        'REMOTE_INSTALL_YACONA_LCK': 'Installation is locked',
        'EVENT_NOT_FOUND': 'Event was not found',
        'FILE_NOT_FOUND': 'File was not found',
        'MISSING_REQUIRED_ARGUMENTS': 'Missing required arguments',
        'PATH_CANNOT_BE_USED': 'This path can\'t be used'
    }
    return {
        status: false,
        statusText: messages[errorCode]
    }
}

const complete = () => {
    return {
        status: true
    }
}

module.exports = { error: error, complete: complete }