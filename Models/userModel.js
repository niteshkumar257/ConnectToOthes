import mongoose from "mongoose";

const UserSchema = mongoose.Schema(
    {
        username: { type: String, required: true, unique: true },
        password : {
            type: String,
            required: true
        },
        firstname: {
            type: String,
            required: true
        },
        lastname : {
            type: String,
            required: true
        },
        isAdmin : {
            type: Boolean,
            default: false,
        },
        profilePicture:{type: String,default:""},
        coverPicture: {type:String,default:""},
        about: {type:String,default:""},
        livesin:{type: String,default:""},
        worksAt:{type:String,default:""},
        relationship: {
         type:String,default:""
        },
        followers: [] ,
        following: []
    },
    {timestamps: true}
)

const UserModel= mongoose.model("Users", UserSchema);
export default UserModel