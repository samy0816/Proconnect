import { Router } from "express";
import { register } from "../controllers/user.controller.js";
import { login } from "../controllers/user.controller.js";
import { uploadProfilePic } from "../controllers/user.controller.js";
import { userUpdate } from "../controllers/user.controller.js";
import { getUserAndProfile } from "../controllers/user.controller.js";
import { updateProfiledata } from "../controllers/user.controller.js";
import { getallusers } from "../controllers/user.controller.js";
import { downloadProfile } from "../controllers/user.controller.js";
import { sendConnectionRequest } from "../controllers/user.controller.js";
import { getmyConnections, getAllMyConnectionsIncludingPending } from "../controllers/user.controller.js";
import { whataremyConnections } from "../controllers/user.controller.js";
import { acceptconnectionRequest } from "../controllers/user.controller.js";
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
router.route('/upload_profile_pic').post(upload.single('profile_pic'), uploadProfilePic); 


router.route('/register').post(register);
router.route('/login').post(login);
router.route('/user_update').post(userUpdate);
router.route('/get_user_and_profile').post(getUserAndProfile);
router.route('/update_profile_data').post(updateProfiledata);
router.route('/user/get_all_users').get(getallusers);
router.route('/user/download_profile').get(downloadProfile);
router.route('/user/send_connection_request').post(sendConnectionRequest);
router.route('/user/get_my_connections').get(getmyConnections);
router.route('/user/get_all_my_connections').get(getAllMyConnectionsIncludingPending);
router.route('/user/what_are_my_connections').get(whataremyConnections);
router.route('/user/accept_connection_request').post(acceptconnectionRequest);
export default router;