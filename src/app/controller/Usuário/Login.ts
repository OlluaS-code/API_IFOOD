import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as yup from 'yup';
import { validation } from '../../shared/middlewares/Validation';
import { UserRepository } from '../../database/Usuário/UsuarioData';


export interface ILoginBody {
  email: string;
  password: string;
}

export const loginValidation = validation((getSchema) => ({
  body: getSchema<ILoginBody>(yup.object().shape({
    email: yup.string().email().required().min(5),
    password: yup.string().required().min(6),
  })),
}));


export const login = async (req: Request<{}, {}, ILoginBody>, res: Response) => {

  const { email, password } = req.body;

  const user = UserRepository.findByEmail(email);

  if (!user) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      error: 'Email ou senha inválidos.'
    });
  }

  const isPasswordValid = user.password === password;

  return isPasswordValid
    ? res.status(StatusCodes.OK).json({
        message: 'Login realizado com sucesso!',
        token: 'SIMULATED_JWT_TOKEN_' + user.id
      })
    : res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Email ou senha inválidos.' });
};
