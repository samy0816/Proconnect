import { Router } from "express";
import { activeCheck } from "../controllers/post.controller.js";
import { createPost } from "../controllers/post.controller.js";
import { getallPost } from "../controllers/post.controller.js";
import { deletePost } from "../controllers/post.controller.js";
import { getallcomments } from "../controllers/post.controller.js";
import { incrementlike } from "../controllers/post.controller.js";
import { commentdelete } from "../controllers/post.controller.js";
import { commentsOnPost } from "../controllers/post.controller.js";
import multer from "multer";
const router = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    // Generate unique filename to avoid conflicts
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
  }
});

// File filter for images only
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

router.route('/active').get(activeCheck);

router.route('/create_post').post(upload.single('media'), createPost);
router.route('/posts').get(getallPost);
router.route('/delete_post').post(deletePost);
router.route('/get_all_comments').post(getallcomments);
router.route('/increment_like').post(incrementlike);
router.route('/delete_comment').post(commentdelete);
router.route('/comment_on_post').post(commentsOnPost);
export default router;
