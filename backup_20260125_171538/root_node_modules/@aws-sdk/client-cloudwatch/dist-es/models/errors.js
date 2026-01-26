import { CloudWatchServiceException as __BaseException } from "./CloudWatchServiceException";
export class ConcurrentModificationException extends __BaseException {
    name = "ConcurrentModificationException";
    $fault = "client";
    Message;
    constructor(opts) {
        super({
            name: "ConcurrentModificationException",
            $fault: "client",
            ...opts,
        });
        Object.setPrototypeOf(this, ConcurrentModificationException.prototype);
        this.Message = opts.Message;
    }
}
export class ConflictException extends __BaseException {
    name = "ConflictException";
    $fault = "client";
    Message;
    constructor(opts) {
        super({
            name: "ConflictException",
            $fault: "client",
            ...opts,
        });
        Object.setPrototypeOf(this, ConflictException.prototype);
        this.Message = opts.Message;
    }
}
export class DashboardInvalidInputError extends __BaseException {
    name = "DashboardInvalidInputError";
    $fault = "client";
    dashboardValidationMessages;
    constructor(opts) {
        super({
            name: "DashboardInvalidInputError",
            $fault: "client",
            ...opts,
        });
        Object.setPrototypeOf(this, DashboardInvalidInputError.prototype);
        this.dashboardValidationMessages = opts.dashboardValidationMessages;
    }
}
export class DashboardNotFoundError extends __BaseException {
    name = "DashboardNotFoundError";
    $fault = "client";
    constructor(opts) {
        super({
            name: "DashboardNotFoundError",
            $fault: "client",
            ...opts,
        });
        Object.setPrototypeOf(this, DashboardNotFoundError.prototype);
    }
}
export class ResourceNotFound extends __BaseException {
    name = "ResourceNotFound";
    $fault = "client";
    constructor(opts) {
        super({
            name: "ResourceNotFound",
            $fault: "client",
            ...opts,
        });
        Object.setPrototypeOf(this, ResourceNotFound.prototype);
    }
}
export class InternalServiceFault extends __BaseException {
    name = "InternalServiceFault";
    $fault = "server";
    Message;
    constructor(opts) {
        super({
            name: "InternalServiceFault",
            $fault: "server",
            ...opts,
        });
        Object.setPrototypeOf(this, InternalServiceFault.prototype);
        this.Message = opts.Message;
    }
}
export class InvalidParameterCombinationException extends __BaseException {
    name = "InvalidParameterCombinationException";
    $fault = "client";
    constructor(opts) {
        super({
            name: "InvalidParameterCombinationException",
            $fault: "client",
            ...opts,
        });
        Object.setPrototypeOf(this, InvalidParameterCombinationException.prototype);
    }
}
export class InvalidParameterValueException extends __BaseException {
    name = "InvalidParameterValueException";
    $fault = "client";
    constructor(opts) {
        super({
            name: "InvalidParameterValueException",
            $fault: "client",
            ...opts,
        });
        Object.setPrototypeOf(this, InvalidParameterValueException.prototype);
    }
}
export class MissingRequiredParameterException extends __BaseException {
    name = "MissingRequiredParameterException";
    $fault = "client";
    constructor(opts) {
        super({
            name: "MissingRequiredParameterException",
            $fault: "client",
            ...opts,
        });
        Object.setPrototypeOf(this, MissingRequiredParameterException.prototype);
    }
}
export class ResourceNotFoundException extends __BaseException {
    name = "ResourceNotFoundException";
    $fault = "client";
    ResourceType;
    ResourceId;
    Message;
    constructor(opts) {
        super({
            name: "ResourceNotFoundException",
            $fault: "client",
            ...opts,
        });
        Object.setPrototypeOf(this, ResourceNotFoundException.prototype);
        this.ResourceType = opts.ResourceType;
        this.ResourceId = opts.ResourceId;
        this.Message = opts.Message;
    }
}
export class InvalidNextToken extends __BaseException {
    name = "InvalidNextToken";
    $fault = "client";
    constructor(opts) {
        super({
            name: "InvalidNextToken",
            $fault: "client",
            ...opts,
        });
        Object.setPrototypeOf(this, InvalidNextToken.prototype);
    }
}
export class LimitExceededException extends __BaseException {
    name = "LimitExceededException";
    $fault = "client";
    Message;
    constructor(opts) {
        super({
            name: "LimitExceededException",
            $fault: "client",
            ...opts,
        });
        Object.setPrototypeOf(this, LimitExceededException.prototype);
        this.Message = opts.Message;
    }
}
export class LimitExceededFault extends __BaseException {
    name = "LimitExceededFault";
    $fault = "client";
    constructor(opts) {
        super({
            name: "LimitExceededFault",
            $fault: "client",
            ...opts,
        });
        Object.setPrototypeOf(this, LimitExceededFault.prototype);
    }
}
export class InvalidFormatFault extends __BaseException {
    name = "InvalidFormatFault";
    $fault = "client";
    constructor(opts) {
        super({
            name: "InvalidFormatFault",
            $fault: "client",
            ...opts,
        });
        Object.setPrototypeOf(this, InvalidFormatFault.prototype);
    }
}
