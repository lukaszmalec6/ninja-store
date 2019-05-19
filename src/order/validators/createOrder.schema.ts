import {object, string, ObjectSchema} from 'joi';

export const createOrderSchema: ObjectSchema = object().keys({
  productId: string().guid({ version : 'uuidv4' }).required()
});