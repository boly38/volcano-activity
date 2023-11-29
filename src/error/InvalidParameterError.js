import ErrorConstants from './ErrorConstants.js';

export default class InvalidParameterError {
    constructor(userDetails = null) {
        this.code = ErrorConstants.INVALID_PARAMETER.code;
        this.status = 400;
        this.details = userDetails ? userDetails : ErrorConstants.INVALID_PARAMETER.message;
    }
}

