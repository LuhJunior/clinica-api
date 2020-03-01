import { Application } from 'express';

import useModules from './modules';
import useMiddlewares from './middlewares';
import useRoutes from './routes';

export default (app: Application): Application => {
    useModules(app);
    useRoutes(app);
    useMiddlewares(app);
    return app;
};
