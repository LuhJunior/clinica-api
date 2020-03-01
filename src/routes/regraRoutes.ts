import { Router } from 'express';

import RegraController from '../controllers/RegraController';

import validators from '../middlewares/validators';
import checkValidation from '../utils/checkValidation';

const routes = Router();

routes.get('/', RegraController.findAll);
routes.get('/:id', validators.regraValidator.get, checkValidation, RegraController.find);

routes.post('/', validators.regraValidator.post, checkValidation, RegraController.create);

routes.delete('/:id', validators.regraValidator.delete, checkValidation, RegraController.delete);

export default routes;
