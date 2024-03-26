import { Catch, ArgumentsHost, HttpStatus, HttpException } from "@nestjs/common";
import { BaseExceptionFilter } from "@nestjs/core";
import { Request, Response } from "express";
import { Logger } from "@nestjs/common";

type myResponse = {
    statusCode: number,
    timestamp: string,
    path: string,
    response: string | object,
}

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
    private readonly logger = new Logger(AllExceptionsFilter.name);

    catch(exception: Error, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
        const message = exception instanceof HttpException ? exception.getResponse() : 'Internal Server Error';
        const errorMessage = typeof message === 'object' && message !== null && 'message' in message ? (message as { message: string })['message'] : message as string;
        const errorResponse: myResponse = {
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            response: errorMessage,
        }
        this.logger.error(`Error: ${JSON.stringify(errorResponse)}`);
        response.status(status).send({ success: false, message: errorResponse });

        super.catch(exception, host);
    }
}