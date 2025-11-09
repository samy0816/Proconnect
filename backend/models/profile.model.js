import mongoose from "mongoose";



const educationSchema = new mongoose.Schema(
  {
    school: {
      type: String,
      required: true
    },
    degree: {
      type: String,
      required: true
    },
    fieldOfStudy: {
      type: String,
      required: true
    },
  });


  const workSchema = new mongoose.Schema(   
  {
    company: {
      type: String,
      required: true
    },
    position: {
      type: String,
      required: true
    },
   years:{
     type: Number,
     required: true
   }
});

const profileSchema = new mongoose.Schema(
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      bio:{
        type:String,
        default:''
      },
      currentPost:{
        type:String,
        default:''
      },
      education: {
        type: [educationSchema],
        default: []
      },
      work: {
        type: [workSchema],
        default: []
      },
    }
);

const Profile = mongoose.model('Profile', profileSchema);
const Education = mongoose.model('Education', educationSchema);

export default Profile;
export { Education };
