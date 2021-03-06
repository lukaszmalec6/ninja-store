import {BadRequestException} from '@nestjs/common';
 import{Request, Response} from 'express';
import {validate, ObjectSchema} from 'joi';

export const paramValidator = (validatorSchema: ObjectSchema) =>
  (req: Request, res: Response, next: Function) => {
    const result = validate(req.params, validatorSchema);
    if (result.error) {
      const errorMessage = result.error.details.shift().message;
      const message: string = errorMessage.replace(/["]/g, '');
      return next(new BadRequestException(`Validation error: ${message}`));
    }
    next();
  };
