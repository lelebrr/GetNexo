import { ExceptionOptionType as __ExceptionOptionType } from "@smithy/smithy-client";
import { CloudWatchServiceException as __BaseException } from "./CloudWatchServiceException";
import { DashboardValidationMessage } from "./models_0";
export declare class ConcurrentModificationException extends __BaseException {
  readonly name: "ConcurrentModificationException";
  readonly $fault: "client";
  Message?: string | undefined;
  constructor(
    opts: __ExceptionOptionType<
      ConcurrentModificationException,
      __BaseException
    >
  );
}
export declare class ConflictException extends __BaseException {
  readonly name: "ConflictException";
  readonly $fault: "client";
  Message?: string | undefined;
  constructor(opts: __ExceptionOptionType<ConflictException, __BaseException>);
}
export declare class DashboardInvalidInputError extends __BaseException {
  readonly name: "DashboardInvalidInputError";
  readonly $fault: "client";
  dashboardValidationMessages?: DashboardValidationMessage[] | undefined;
  constructor(
    opts: __ExceptionOptionType<DashboardInvalidInputError, __BaseException>
  );
}
export declare class DashboardNotFoundError extends __BaseException {
  readonly name: "DashboardNotFoundError";
  readonly $fault: "client";
  constructor(
    opts: __ExceptionOptionType<DashboardNotFoundError, __BaseException>
  );
}
export declare class ResourceNotFound extends __BaseException {
  readonly name: "ResourceNotFound";
  readonly $fault: "client";
  constructor(opts: __ExceptionOptionType<ResourceNotFound, __BaseException>);
}
export declare class InternalServiceFault extends __BaseException {
  readonly name: "InternalServiceFault";
  readonly $fault: "server";
  Message?: string | undefined;
  constructor(
    opts: __ExceptionOptionType<InternalServiceFault, __BaseException>
  );
}
export declare class InvalidParameterCombinationException extends __BaseException {
  readonly name: "InvalidParameterCombinationException";
  readonly $fault: "client";
  constructor(
    opts: __ExceptionOptionType<
      InvalidParameterCombinationException,
      __BaseException
    >
  );
}
export declare class InvalidParameterValueException extends __BaseException {
  readonly name: "InvalidParameterValueException";
  readonly $fault: "client";
  constructor(
    opts: __ExceptionOptionType<InvalidParameterValueException, __BaseException>
  );
}
export declare class MissingRequiredParameterException extends __BaseException {
  readonly name: "MissingRequiredParameterException";
  readonly $fault: "client";
  constructor(
    opts: __ExceptionOptionType<
      MissingRequiredParameterException,
      __BaseException
    >
  );
}
export declare class ResourceNotFoundException extends __BaseException {
  readonly name: "ResourceNotFoundException";
  readonly $fault: "client";
  ResourceType?: string | undefined;
  ResourceId?: string | undefined;
  Message?: string | undefined;
  constructor(
    opts: __ExceptionOptionType<ResourceNotFoundException, __BaseException>
  );
}
export declare class InvalidNextToken extends __BaseException {
  readonly name: "InvalidNextToken";
  readonly $fault: "client";
  constructor(opts: __ExceptionOptionType<InvalidNextToken, __BaseException>);
}
export declare class LimitExceededException extends __BaseException {
  readonly name: "LimitExceededException";
  readonly $fault: "client";
  Message?: string | undefined;
  constructor(
    opts: __ExceptionOptionType<LimitExceededException, __BaseException>
  );
}
export declare class LimitExceededFault extends __BaseException {
  readonly name: "LimitExceededFault";
  readonly $fault: "client";
  constructor(opts: __ExceptionOptionType<LimitExceededFault, __BaseException>);
}
export declare class InvalidFormatFault extends __BaseException {
  readonly name: "InvalidFormatFault";
  readonly $fault: "client";
  constructor(opts: __ExceptionOptionType<InvalidFormatFault, __BaseException>);
}
