import {object, string, ObjectSchema, number} from 'joi';

export const createProductSchema: ObjectSchema = object().keys({
  name: string().min(3).max(130).required(),
  imageUrl: string().min(10).max(230).required(),
  price: number().strict().min(0.1).required(),
  description: string().min(5).max(130).required(),
  categoryId: string().required()
});