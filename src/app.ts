import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import morgan from 'morgan';
import session from 'express-session';
import router from './routers';

import { sessionSecret } from '../.credential';

const app = express();

// logger
app.use(morgan('dev'));
// static
app.use(express.static(path.resolve(__dirname, '../public')));
// body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// session
app.use(
  session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
  })
);

// view engine
app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, './views'));

// router
app.use(router);

// error
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res
    .status(500)
    .render('error', { code: 500, message: 'Internal Server Error' });
});
app.use((req, res) => {
  res.status(404).render('error', { code: 404, message: 'Not Found' });
});

export default app;
