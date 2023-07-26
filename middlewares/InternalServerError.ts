import { Request, Response } from 'express';

const internalServerError = (req: Request, res: Response) => {
  res.status(404).render('404');
};

export default internalServerError;
