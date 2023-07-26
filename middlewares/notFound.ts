import { Request, Response, NextFunction } from 'express';
const notFound = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err);
  res.status(500).render('500');
};

export default notFound;
