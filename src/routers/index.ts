import posts from './post';
import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.render('index');
});

router.use('/posts', posts);  

export default router;
