import {
  ErrorRequestHandler,
  Request,
  Response,
  NextFunction,
} from 'express';

interface CustomErr extends ErrorRequestHandler {
  code: number,
  message: string,
  isOperational?: boolean,
}

export function logErrors(err: CustomErr, req: Request, res: Response, next: NextFunction): void {
  console.log(JSON.stringify({
    level: 'error',
    message: [
      `method: ${req.method} - url: ${req.originalUrl} - ip: ${req.ip}`,
      `  params: ${JSON.stringify(req.params)}`,
      `  query: ${JSON.stringify(req.query)}`,
      `  body: ${JSON.stringify(req.body)}`,
      `  errCode: ${err.code} - errMessage: ${err.message} - isOperational: ${err.isOperational}`,
    ].join('\n'),
  }));
  return next(err);
}

export function errorHandler(err: CustomErr, req: Request, res: Response, next: NextFunction): void {
  if (err.isOperational) {
    res.status(err.code).send({ data: err });
  } else {
    res.status(500).send({ error: 'Ocorreu um erro interno' });
  }
}

export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).send({ message: 'Rota nao encontrada' });
}
