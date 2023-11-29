import {isSet} from "../service/util.js";
import InvalidParameterError from "../error/InvalidParameterError.js";
import UnauthorizedError from "../error/UnauthorizedError.js";

function assumeCaptcha(req) {
    assumeRequiredFields(req.body, ["captcha"]);
    const {captcha} = req.body;
    if (!isSet(captcha) || captcha !== req?.session?.captchaText)
    throw new InvalidParameterError("Invalid captcha");
}

function assumeModerator(req) {
    if (true === req?.auth?.isModerator) {
        return;
    }
    throw new UnauthorizedError("You must be moderator to do this action");
}

function assumeRequiredFields(input, requirements) {
    if (!isSet(requirements)) {
        return;
    }
    if (!isSet(input) && requirements.length > 0) {
        const details = `Expected fields: ${requirements}`;
        throw new InvalidParameterError(details);
    }
    for (const requirement of requirements) {
        if (!requirement in input || !isSet(input[requirement])) {
            const details = `Expected field: ${requirement}`;
            throw new InvalidParameterError(details);
        }
    }
}

function assumeMaxFieldLength(res, fieldName, fieldValue, fieldMaxLength) {
    if (fieldValue !== undefined
        && fieldValue !== null
        && fieldValue.length > fieldMaxLength) {
        throw new InvalidParameterError(res.__('error.input.length.field.max', {fieldMaxLength, fieldName}));
    }
}

function handleError(res, err) {
    let status = err.status;
    let code = err.code;
    let error = err.details ? err.details : err.message;
    if (!status) { // If err has no specified error code, set error code to 'Internal Server Error (500)'
        status = 500;
        console.error("500 ERROR", err);// print stack
        error = "Unexpected error";// mask details for end-users
    }
    res.status(status).json({ status, code, error });
}


// Export the function to be used in other modules
export {assumeCaptcha, assumeModerator, assumeRequiredFields, assumeMaxFieldLength,handleError};