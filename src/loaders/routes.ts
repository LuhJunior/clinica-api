import { Application } from 'express';

import routes from '../routes';

export default (app: Application): void => {
    app.use('/api/regra', routes.regraRoutes);
};
