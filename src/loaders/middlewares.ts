import { Application } from 'express';
import {
    logErrors,
    errorHandler,
    notFoundHandler,
} from '../middlewares/errorMiddlewares';

export default (app: Application): void => {
    app.use(logErrors);
    app.use(errorHandler);
    app.use(notFoundHandler);
};
