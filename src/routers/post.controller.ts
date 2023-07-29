import type { NextFunction, Request, Response } from 'express';
import { BoardModel } from '../models/board.model';
import contains from '../utils/contains';

const board = new BoardModel();

export const renderPostIndex = (req: Request, res: Response) => {
  const posts = board.getAllPosts();
  res.render('posts/index', { posts });
};

export const createNewPost = (req: Request, res: Response) => {
  const { title, writer, content, password } = req.body;
  const fullIpAddr = req.socket.remoteAddress!;

  if (!title || !writer || !content || !password) {
    return res.status(400).render('400', { message: '필드를 전부 채우세요.' });
  }

  board.addPost({ title, writer, content, password, fullIpAddr });
  res.redirect('/posts');
};

export const renderNewPostForm = (req: Request, res: Response) => {
  res.render('posts/new');
};

export const renderPostById = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = parseInt(req.params.id);
  const post = board.getPostById(id);

  if (!post) return next();
  res.render('posts/post', { post, comments: post.comments });
};

export const renderEditPostForm = (
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

export const updatePost = (req: Request, res: Response) => {
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
export const renderAuthForm = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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

export const deletePost = (req: Request, res: Response, next: NextFunction) => {
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

export const authenticatePost = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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

export const createNewComment = (req: Request, res: Response) => {
  const postId = parseInt(req.params.id);
  const { writer, content, password } = req.body;
  const fullIpAddr = req.socket.remoteAddress!;
  if (!writer || !content || !password)
    return res.status(400).json({ message: 'back:필드가 비어있음' });
  board.addComment(postId, { writer, content, password, fullIpAddr });
  res.redirect(`/posts/${postId}`);
};

export const deleteComment = (req: Request, res: Response) => {
  const postId = parseInt(req.params.postId),
    commentId = parseInt(req.params.commentId);
  // 세션인증 필요
  const allowedComment = req.session.allowedComment;
  if (!allowedComment) return res.status(403).json({ message: '권한이 없음' });
  const [allowedPostId, allowedCommentId] = allowedComment;

  if (allowedPostId !== postId || allowedCommentId !== commentId) {
    return res.status(403).json({ message: '허용된 권한이 일치하지 않음' });
  }
  //삭제
  if (!board.deleteComment(postId, commentId))
    return res.status(400).json({ message: '없는 포스트나 코멘트' });
  // TODO:세션파괴

  res.sendStatus(204);
};

export const authenticateComment = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const postId = parseInt(req.params.postId),
    commentId = parseInt(req.params.commentId);
  const { password } = req.body;
  // postId와 commentId를 이용해서 해당하는 코멘트를 찾는다
  // 해당 코멘트의 비밀번호를 비교해야함
  const comment = board.getCommentById(postId, commentId);
  if (!comment) return next();

  console.log(comment.password, password);
  if (comment.password != password)
    return res.status(400).json({ message: '비밀번호가 올바르지 않음.' });

  req.session.allowedComment = [postId, commentId];
  res.sendStatus(200);
};
