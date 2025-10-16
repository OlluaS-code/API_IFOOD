import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { OrderRepository } from '../../database/Order/OrderData';


export const getOrders = async (req: Request, res: Response) => {

  const userId = Number(req.userId);

  const ordersList = OrderRepository.getOrdersByUser(userId);

  return res.status(StatusCodes.OK).json(ordersList);
};
