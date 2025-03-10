import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'USERNAME IS REQUIRED'],
    trim: true,
    minLength: 2,
    maxLength: 50,

  },
  email: {
    type: String,
    required: [true, 'USER EMAIL IS REQUIRED'],
    trim: true,
    lowercase: true,
    match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'PLEASE FILL A VALID EMAIL'],
  },
  password: {
    type: String,
    required: [true, 'USER PASSWORD IS REQUIRED'],
    minLength: 6

  }
}, {
  timestamps: true
});
const User = mongoose.model('User', userSchema);

export default User;
