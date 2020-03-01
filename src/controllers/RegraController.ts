import { Request, Response, NextFunction } from 'express';

import RegraService from '../services/RegraService';

class RegraController {
    public async create (req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const data = await RegraService.store(req.body);
            return res.status(200).send({ ok: true, data });
        } catch (e) {
            return next(e);
        }
    }

    public async find (req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const data = await RegraService.find(parseInt(req.params.id));
            return res.status(200).send({ ok: true, data });
        } catch (e) {
            return next(e);
        }
    }

    public async findAll (req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const data = await RegraService.findAll();
            return res.status(200).send({ ok: true, data });
        } catch (e) {
            return next(e);
        }
    }
    public async delete (req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const data = await RegraService.destroy(parseInt(req.params.id));
            return res.status(200).send({ ok: true, data });
        } catch (e) {
            return next(e);
        }
    }
};

export default new RegraController();
