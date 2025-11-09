import mongoose from "mongoose";


const connectionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    connectedUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    status_accepted: {
    type: Boolean,
    default: false
    },
    fileType: {
      type: String,
      default: ''
  }
});

const Connection = mongoose.model('Connection', connectionSchema);
export default Connection;
