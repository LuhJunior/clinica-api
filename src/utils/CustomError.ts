export default class CustomError extends Error {
    code: number;
    message: string;
    isOperational: boolean;
    body: Object;

    constructor (code?: number, message?: string, isOperational?: boolean, body?: Object) {
        super();
        this.code = code || 500;
        this.message = message || 'Erro Interno';
        this.isOperational = isOperational || false;
        this.body = body || {};
    }
}
