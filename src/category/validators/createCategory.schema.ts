import {object, string, ObjectSchema} from 'joi';

export const createCategorySchema: ObjectSchema = object().keys({
  name: string().min(3).max(130).required()
});