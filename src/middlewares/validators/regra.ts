import { check, param, query } from 'express-validator';

import { Tipos } from '../../utils/RegraTipo';

import { dateValidator, hourValidator } from '../../utils/validators';

export default {
    post: [
        check('tipo')
            .notEmpty()
            .isString()
            .isIn(Tipos),
        check('horario.inicio')
            .notEmpty()
            .isString()
            .custom(hourValidator),
        check('horario.termino')
            .notEmpty()
            .isString()
            .custom(hourValidator),
        check('dia')
            .optional()
            .notEmpty()
            .isString()
            .custom(dateValidator),
        check('dias')
            .optional()
            .notEmpty()
            .isArray(),
    ],
    get: [
        param('id')
            .notEmpty()
            .isInt()
            .toInt(),
    ],
    getByInterval: [
        query('dataInicio')
            .notEmpty()
            .isString()
            .custom(dateValidator),
        query('dataFim')
            .notEmpty()
            .isString()
            .custom(dateValidator),
    ],
    delete: [
        param('id')
            .notEmpty()
            .isInt()
            .toInt(),
    ],
};
