import UserService from '@/services/user';
import { Router, Request, Response } from 'express';
import { Container } from 'typedi';
import { IDeliveryInputDTO } from '@/interfaces/IUser';
import middlewares from '../middlewares';
const route = Router();

export default (app: Router) => {
  app.use('/users', route);

  route.get('/me', middlewares.isAuth, middlewares.attachCurrentUser, (req: Request, res: Response) => {
    return res.json({ user: req.currentUser }).status(200);
  });
  
  route.post('/getdate', async(req: Request, res: Response) => {
    const userServiceInstance = Container.get(UserService);
    
    let deliveryDate = await userServiceInstance.GetDates(req.body as IDeliveryInputDTO)
    return res.json(deliveryDate)
    // return res.json({ user: req.currentUser }).status(200);
  });
};
