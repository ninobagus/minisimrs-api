import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiConflictResponse,
  ApiInternalServerErrorResponse,
  getSchemaPath,
  ApiExtraModels,
} from '@nestjs/swagger';
import { SuccessResponseDto, ErrorResponseDto } from '../dto/response.dto';

export const ApiSuccessResponse = <TModel extends Type<any>>(
  model: TModel,
  isArray = false,
  status: 'ok' | 'created' = 'ok',
) => {
  const decorator = status === 'created' ? ApiCreatedResponse : ApiOkResponse;
  
  return applyDecorators(
    ApiExtraModels(SuccessResponseDto, model),
    decorator({
      description: status === 'created' ? 'Resource created successfully' : 'Request successful',
      schema: {
        allOf: [
          { $ref: getSchemaPath(SuccessResponseDto) },
          {
            properties: {
              data: isArray
                ? { type: 'array', items: { $ref: getSchemaPath(model) } }
                : { $ref: getSchemaPath(model) },
            },
          },
        ],
      },
    }),
  );
};

export const ApiErrorResponses = () => {
  return applyDecorators(
    ApiExtraModels(ErrorResponseDto),
    ApiBadRequestResponse({
      description: 'Validation failed or bad request',
      type: ErrorResponseDto,
    }),
    ApiUnauthorizedResponse({
      description: 'Unauthorized - Invalid or missing credentials',
      type: ErrorResponseDto,
    }),
    ApiForbiddenResponse({
      description: 'Forbidden - Insufficient permissions',
      type: ErrorResponseDto,
    }),
    ApiNotFoundResponse({
      description: 'Resource not found',
      type: ErrorResponseDto,
    }),
    ApiConflictResponse({
      description: 'Conflict - Resource already exists or invalid state',
      type: ErrorResponseDto,
    }),
    ApiInternalServerErrorResponse({
      description: 'Internal server error',
      type: ErrorResponseDto,
    }),
  );
};
