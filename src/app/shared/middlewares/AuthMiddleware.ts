import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

declare module 'express-serve-static-core' {
  interface Request {
    usuario_ID?: number;
  }
}

export const ensureAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            error: 'Token não fornecido. Acesso negado.'
        });
    }

    const token = authHeader.split(' ')[1];

    if (token === 'SIMULATED_TOKEN_1') {
        req.usuario_ID = 1;

        return next();
    }

    return res.status(StatusCodes.UNAUTHORIZED).json({
        error: 'Token inválido ou expirado.'
    });
};
