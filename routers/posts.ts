import express from 'express';
import type { NextFunction, Request, Response } from 'express';
import { createPost, BoardModel, IPost } from '../models/boardModel';

const router = express.Router();
const board = new BoardModel();

const renderPostIndex = (req: Request, res: Response) => {
  const posts = board.getAllPosts();

  res.render('posts/index', { posts });
};

const createNewPost = (req: Request, res: Response) => {
  const { title, writer, content, password } = req.body;

  if (!title || !writer || !content || !password)
    res.status(400).render('400', { message: '필드를 전부 채우세요.' });

  const post = createPost(title, content, writer, password);
  board.addPost(post);

  res.redirect('/posts');
};

const renderNewPostForm = (req: Request, res: Response) => {
  res.render('posts/new');
};

const renderPostById = (req: Request, res: Response, next: NextFunction) => {
  const id = parseInt(req.params.id);
  const post = board.getPostById(id);

  if (!post) return next();

  res.render('posts/post', { post });
};

const renderEditPostForm = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = parseInt(req.params.id);
  const post = board.getPostById(id);
  if (!post) return next();

  console.log(req.body);

  const password = req.body.password;
  if (password !== post.password)
    return res.status(400).json({ message: '비밀번호가 올바르지 않습니다.' }); // 추후에 에러코드로 모아서 작성하면 좋겠다.

  res.render('posts/edit', { post });
};

const updatePost = (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const post = board.getPostById(id);

  if (!post)
    return res
      .status(404)
      .json({ message: '해당 번호의 포스트 존재하지 않음' });

  const { title, content } = req.body;

  if (!title || !content) {
    console.error(title, content);
    return res.status(400).json({ message: '필드를 채우세요' });
  }

  const updatedPost: IPost = {
    id: post.id,
    writer: post.writer,
    content,
    title,
    date: post.date,
    password: post.password,
  };

  board.modifyPost(id, updatedPost);

  res.sendStatus(200);
};

const renderAuthForm = (req: Request, res: Response, next: NextFunction) => {
  const id = parseInt(req.params.id);

  const post = board.getPostById(id);
  if (!post) return next();

  res.render('posts/auth', { id });
};

router.get('/', renderPostIndex);
router.get('/new', renderNewPostForm);
router.post('/:id/edit', renderEditPostForm);
router.get('/:id', renderPostById);
router.post('/', createNewPost);
router.get('/:id/auth', renderAuthForm); // todo
router.put('/:id', updatePost);
router.delete('/:id', (req, res, next) => {
  const id = parseInt(req.params.id);

  const post = board.getPostById(id);
  if (!post) return next();

  board.deletePost(id);
  console.log(board.getAllPosts());
  res.sendStatus(204);
}); // todo

export default router;
