import ErrorConstants from './ErrorConstants.js';

export default class UnauthorizedError {
    constructor(userDetails = null) {
        this.code = ErrorConstants.UNAUTHORIZED.code;
        this.status = 401;
        this.details = userDetails ? userDetails : ErrorConstants.UNAUTHORIZED.message;
    }
}

