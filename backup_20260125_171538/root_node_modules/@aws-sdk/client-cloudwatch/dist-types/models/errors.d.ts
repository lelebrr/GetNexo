import type { ExceptionOptionType as __ExceptionOptionType } from "@smithy/smithy-client";
import { CloudWatchServiceException as __BaseException } from "./CloudWatchServiceException";
import { DashboardValidationMessage } from "./models_0";
/**
 * <p>More than one process tried to modify a resource at the same time.</p>
 * @public
 */
export declare class ConcurrentModificationException extends __BaseException {
    readonly name: "ConcurrentModificationException";
    readonly $fault: "client";
    Message?: string | undefined;
    /**
     * @internal
     */
    constructor(opts: __ExceptionOptionType<ConcurrentModificationException, __BaseException>);
}
/**
 * <p>This operation attempted to create a resource that already exists.</p>
 * @public
 */
export declare class ConflictException extends __BaseException {
    readonly name: "ConflictException";
    readonly $fault: "client";
    Message?: string | undefined;
    /**
     * @internal
     */
    constructor(opts: __ExceptionOptionType<ConflictException, __BaseException>);
}
/**
 * <p>Some part of the dashboard data is invalid.</p>
 * @public
 */
export declare class DashboardInvalidInputError extends __BaseException {
    readonly name: "DashboardInvalidInputError";
    readonly $fault: "client";
    dashboardValidationMessages?: DashboardValidationMessage[] | undefined;
    /**
     * @internal
     */
    constructor(opts: __ExceptionOptionType<DashboardInvalidInputError, __BaseException>);
}
/**
 * <p>The specified dashboard does not exist.</p>
 * @public
 */
export declare class DashboardNotFoundError extends __BaseException {
    readonly name: "DashboardNotFoundError";
    readonly $fault: "client";
    /**
     * @internal
     */
    constructor(opts: __ExceptionOptionType<DashboardNotFoundError, __BaseException>);
}
/**
 * <p>The named resource does not exist.</p>
 * @public
 */
export declare class ResourceNotFound extends __BaseException {
    readonly name: "ResourceNotFound";
    readonly $fault: "client";
    /**
     * @internal
     */
    constructor(opts: __ExceptionOptionType<ResourceNotFound, __BaseException>);
}
/**
 * <p>Request processing has failed due to some unknown error, exception, or
 *             failure.</p>
 * @public
 */
export declare class InternalServiceFault extends __BaseException {
    readonly name: "InternalServiceFault";
    readonly $fault: "server";
    /**
     * <p></p>
     * @public
     */
    Message?: string | undefined;
    /**
     * @internal
     */
    constructor(opts: __ExceptionOptionType<InternalServiceFault, __BaseException>);
}
/**
 * <p>Parameters were used together that cannot be used together.</p>
 * @public
 */
export declare class InvalidParameterCombinationException extends __BaseException {
    readonly name: "InvalidParameterCombinationException";
    readonly $fault: "client";
    /**
     * @internal
     */
    constructor(opts: __ExceptionOptionType<InvalidParameterCombinationException, __BaseException>);
}
/**
 * <p>The value of an input parameter is bad or out-of-range.</p>
 * @public
 */
export declare class InvalidParameterValueException extends __BaseException {
    readonly name: "InvalidParameterValueException";
    readonly $fault: "client";
    /**
     * @internal
     */
    constructor(opts: __ExceptionOptionType<InvalidParameterValueException, __BaseException>);
}
/**
 * <p>An input parameter that is required is missing.</p>
 * @public
 */
export declare class MissingRequiredParameterException extends __BaseException {
    readonly name: "MissingRequiredParameterException";
    readonly $fault: "client";
    /**
     * @internal
     */
    constructor(opts: __ExceptionOptionType<MissingRequiredParameterException, __BaseException>);
}
/**
 * <p>The named resource does not exist.</p>
 * @public
 */
export declare class ResourceNotFoundException extends __BaseException {
    readonly name: "ResourceNotFoundException";
    readonly $fault: "client";
    ResourceType?: string | undefined;
    ResourceId?: string | undefined;
    Message?: string | undefined;
    /**
     * @internal
     */
    constructor(opts: __ExceptionOptionType<ResourceNotFoundException, __BaseException>);
}
/**
 * <p>The next token specified is invalid.</p>
 * @public
 */
export declare class InvalidNextToken extends __BaseException {
    readonly name: "InvalidNextToken";
    readonly $fault: "client";
    /**
     * @internal
     */
    constructor(opts: __ExceptionOptionType<InvalidNextToken, __BaseException>);
}
/**
 * <p>The operation exceeded one or more limits.</p>
 * @public
 */
export declare class LimitExceededException extends __BaseException {
    readonly name: "LimitExceededException";
    readonly $fault: "client";
    Message?: string | undefined;
    /**
     * @internal
     */
    constructor(opts: __ExceptionOptionType<LimitExceededException, __BaseException>);
}
/**
 * <p>The quota for alarms for this customer has already been reached.</p>
 * @public
 */
export declare class LimitExceededFault extends __BaseException {
    readonly name: "LimitExceededFault";
    readonly $fault: "client";
    /**
     * @internal
     */
    constructor(opts: __ExceptionOptionType<LimitExceededFault, __BaseException>);
}
/**
 * <p>Data was not syntactically valid JSON.</p>
 * @public
 */
export declare class InvalidFormatFault extends __BaseException {
    readonly name: "InvalidFormatFault";
    readonly $fault: "client";
    /**
     * @internal
     */
    constructor(opts: __ExceptionOptionType<InvalidFormatFault, __BaseException>);
}
