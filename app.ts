import express from 'express';
import path from 'path';
import morgan from 'morgan';
import router from './routers/posts';
import internalServerError from './middlewares/InternalServerError';
import notFound from './middlewares/notFound';

const app = express();

// logger
app.use(morgan('dev'));

// body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// view engine
app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, './views'));

// router
app.get('/', (req, res) => {
  res.render('index');
});
app.use('/posts', router);

// error
app.use(internalServerError);
app.use(notFound);

export default app;
