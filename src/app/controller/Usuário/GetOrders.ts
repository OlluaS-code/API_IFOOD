import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { OrderRepository } from '../../database/Order/OrderData';


export const getOrders = async (req: Request, res: Response) => {

  const userId = req.userId as number;

  const ordersList = OrderRepository.getOrdersByUser(userId);

  return res.status(StatusCodes.OK).json(ordersList);
};
