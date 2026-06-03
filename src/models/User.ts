import {
 Schema,
 model
} from "mongoose";

const UserSchema = new Schema({

    email: {

        type: String,

        required: true,

        unique: true
    },

    username: {

        type: String,

        unique: true
    },

    passwordHash: {

        type: String,

        required: true
    },

    role: {

        type: String,

        default: "user"
    },

    status: {

        type: String,

        default: "active"
    },

    lastLogin: Date

},{
   timestamps:true
});

export default model(
   "users",
   UserSchema
);