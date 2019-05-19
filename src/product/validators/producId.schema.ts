import {object, string, ObjectSchema} from 'joi';

export const productIdSchema: ObjectSchema = object().keys({
  productId: string().guid({ version : 'uuidv4' }).required()
});