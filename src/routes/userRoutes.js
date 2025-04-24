import express from 'express';
import { getAllUsers,addUserDetails,addUserResume } from '../controllers/user_controller.js';
import { upload } from "../middlewares/upload.js";
// import authMiddleware from '../middlewares/authMiddleware.js';
// import adminMiddleware from '../middlewares/adminMiddleware.js';

const router = express.Router();

router.get('/',  getAllUsers);
router.post('/user-detail',  addUserDetails);
router.post('/user-resume',  upload.single('resume'),  addUserResume);
router.post('/user-experience',   addUserResume);


router.get('/:id', getUserById);
router.put('/:id',  updateUser);
// router.delete('/:id', adminMiddleware, deleteUser);

export default router;