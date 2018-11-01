import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler } from '@angular/core';
import { environment } from '../../environments/environment';
import { CustomError } from './custom-error';
import { UnreachableError } from "./unreachable-error";
import { BadInputError } from "./bad-input-error";
import { ForbiddenError } from "./forbidden-error";
import { NotFoundError } from "./not-found-error";
import { BaseError } from "./base-error";



export class AppErrorHandler implements ErrorHandler {
    handleError(err) {
        let error: any = null;
        let message: any = null;

        if (err instanceof CustomError) {
            error = err.originalError;
            message = err.message;
        } else {
            error = err;
        }

        if (error instanceof HttpErrorResponse) {
            message = 'BACKEND: ' + message

            switch (error.status) {
                case 0: {
                    error = new UnreachableError(error.error);
                    message = message + ' - Unreachable Error';
                    break;
                }
                case 400: {
                    error = new BadInputError(error.error);
                    message = message + ' - Bad Input Error';
                    break;
                }
                case 403: {
                    error = new ForbiddenError(error.error);
                    message = message + ' - Forbidden Error';
                    break;
                }
                case 404: {
                    error = new NotFoundError(error.error);
                    message = message + ' - Not Found Error';
                    break;
                }
                default: {
                    error = new BaseError(error.error)
                    message = message + ' - Base Error';
                    break;
                }
            }
        } else if (error instanceof Error) {
            message = 'FRONTEND: ' + message
            // Additional processing for GENERAL exceptions
        } else {
            // For anything else
        }

        console.log(error);
        console.log(message);

;
    }
}
