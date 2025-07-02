import mongoose from 'mongoose';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const userSChema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    }, 
    password: {
        type: String,
        required: true
    },
    isAdmin:{
        type: Boolean,
        default: false
    },
    avatar: {
        type: String,
        default: ''
    },
    bio: {
        type: String,
        default: ''
    },
    address: {
        type: String,
        default: ''
    },
    createAt:{
        type: Date,
        default: Date.now
    }
  })
  userSChema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
  });
  //生成jwt
  userSChema.methods.generateAuthToken = function() {
    return jwt.sign({ id: this._id, isAdmin: this.isAdmin }, 'yourSecretKey');
  }
 //默认导出
export default mongoose.model('User', userSChema);
