import express from 'express';
import {
    getAllPosts,
    createPost,
    applyToJob,
  } from '../controllers/job_controller.js';

const router = express.Router();


router.get('/', getAllPosts);
router.post('/create',  createPost);
router.post('/applys',  applyToJob);


// router.get('/:id', getPostById);
// router.put('/:id', authMiddleware, updatePost);
// router.delete('/:id', authMiddleware, deletePost);
// router.post('/:id/like', authMiddleware, likePost);
// router.post('/:id/comment', authMiddleware, commentPost);

export default router;