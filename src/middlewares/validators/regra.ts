import { check, param } from 'express-validator';

import { Tipos } from '../../utils/RegraTipo';

export default {
    post: [
        check('tipo')
            .notEmpty()
            .isString()
            .isIn(Tipos),
        check('horario.inicio')
            .notEmpty()
            .isString(),
        check('horario.termino')
            .notEmpty()
            .isString(),
        check('dia')
            .optional()
            .notEmpty()
            .isString(),
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
    delete: [
        param('id')
            .notEmpty()
            .isInt()
            .toInt(),
    ],
};
