import express from 'express';
import {
  renderNewPostForm,
  renderAuthForm,
  renderEditPostForm,
  updatePost,
  deleteComment,
  deletePost,
  authenticateComment,
  authenticatePost,
  renderPostIndex,
  createNewComment,
  renderPostById,
  createNewPost,
} from './post.controller';

const router = express.Router();

router.route('/').get(renderPostIndex).post(createNewPost);
router.get('/new', renderNewPostForm);

router.route('/:id').get(renderPostById).put(updatePost).delete(deletePost);

router.get('/:id/edit', renderEditPostForm);
router.get('/:id/auth', renderAuthForm);
router.post('/:id/auth', authenticatePost);

router.post('/:id/comments', createNewComment);
router
  .route('/:postId/comments/:commentId')
  .post(authenticateComment)
  .delete(deleteComment);

export default router;
