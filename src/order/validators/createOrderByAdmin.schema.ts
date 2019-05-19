import {object, string, ObjectSchema} from 'joi';

export const createOrderByAdminSchema: ObjectSchema = object().keys({
  productId: string().guid({ version : 'uuidv4' }).required(),
  userId: string().guid({ version : 'uuidv4' }).required()
});