import express from 'express';
import type { NextFunction, Request, Response } from 'express';
import { BoardModel } from '../models/boardModel';
import contains from '../utils/contains';

const router = express.Router();
const board = new BoardModel();

const renderPostIndex = (req: Request, res: Response) => {
  const posts = board.getAllPosts();
  res.render('posts/index', { posts });
};

const createNewPost = (req: Request, res: Response) => {
  const { title, writer, content, password } = req.body;
  const fullIpAddr = req.socket.remoteAddress!;

  if (!title || !writer || !content || !password) {
    return res.status(400).render('400', { message: '필드를 전부 채우세요.' });
  }

  board.addPost({ title, writer, content, password, fullIpAddr });
  res.redirect('/posts');
};

const renderNewPostForm = (req: Request, res: Response) => {
  res.render('posts/new');
};

const renderPostById = (req: Request, res: Response, next: NextFunction) => {
  const id = parseInt(req.params.id);
  const post = board.getPostById(id);

  if (!post) return next();
  res.render('posts/post', { post, comments: post.comments });
};

const renderEditPostForm = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const postId = parseInt(req.params.id);
  const post = board.getPostById(postId);
  if (!post) return next();
  // 세션 검증 후 렌더
  const allowedPostIds = req.session.allowedPostId;
  if (allowedPostIds !== postId) {
    return res.send(403).json({ message: '권한 없음' });
  }
  res.render('posts/edit', { post });
};

const updatePost = (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const post = board.getPostById(id);
  if (!post) {
    return res
      .status(404)
      .json({ message: '해당 번호의 포스트 존재하지 않음' });
  }

  const { title, content } = req.body;
  if (!title || !content) {
    console.error(title, content);
    return res.status(400).json({ message: '어떤 필드가 비어있음' });
  }
  board.modifyPost(id, { title, content });
  res.sendStatus(200);
};
// 세션을 만들기 위한 폼 렌더
const renderAuthForm = (req: Request, res: Response, next: NextFunction) => {
  const id = parseInt(req.params.id);
  const action = req.query.action as string;
  const ACTIONS = ['put', 'delete'] as const;

  const post = board.getPostById(id);
  if (!post) return next();
  // 액션타입 검증
  if (!contains(ACTIONS, action)) {
    return res.status(400).json({ message: '액션타입이 올바르지 않음' });
  }
  res.render('posts/auth', { id, action });
};

const deletePost = (req: Request, res: Response, next: NextFunction) => {
  const id = parseInt(req.params.id);

  const post = board.getPostById(id);
  if (!post) return next();
  // 세션 검증 후 처리
  const allowedPostId = req.session.allowedPostId;
  if (allowedPostId !== id) {
    return res.status(403).json({ message: '권한 없음' });
  }
  board.deletePost(id);
  res.sendStatus(204);
};

const authenticatePost = (req: Request, res: Response, next: NextFunction) => {
  const postId = parseInt(req.params.id);
  const password = req.body.password;

  const post = board.getPostById(postId);
  if (!post) {
    return next();
  }
  if (password !== post.password) {
    return res.status(401).json({ message: '비밀번호가 올바르지 않음' });
  }
  // 세션 생성
  req.session.allowedPostId = postId;
  res.sendStatus(200);
};

router.get('/', renderPostIndex);
router.post('/', createNewPost);
router.get('/new', renderNewPostForm);

router.get('/:id/edit', renderEditPostForm);
router.get('/:id', renderPostById);
router.get('/:id/auth', renderAuthForm);

router.put('/:id', updatePost);
router.delete('/:id', deletePost);

router.post('/:id/auth', authenticatePost);
router.post('/:id/comments', (req, res) => {
  const postId = parseInt(req.params.id);
  const { writer, content, password } = req.body;
  const fullIpAddr = req.socket.remoteAddress!;
  console.log(writer, content, password, fullIpAddr);
  if (!writer || !content || !password)
    return res.status(400).json({ message: 'back:필드가 비어있음' });
  board.addComment(postId, { writer, content, password, fullIpAddr });
  res.redirect(`/posts/${postId}`);
});

router.delete('/:postId/comments/:commentId', (req, res) => {
  const postId = parseInt(req.params.postId),
    commentId = parseInt(req.params.commentId);
  if (!board.deleteComment(postId, commentId))
    return res.status(400).json({ message: '없는 포스트나 코멘트' });
  res.sendStatus(204);
});

export default router;
