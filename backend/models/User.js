import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  profileImage: {
    type: String,
    default: './no-image.jpg'
  },
  phoneNumber: {
    countryCode: {
      type: String,
      default: '+977'
    },
    number: {
      type: String,
      required: [true, 'Phone number is required'],
      unique: true
    }
  },
  billingAddress: {
    type: String,
    default: "Jhapa, Nepal"
  },
  shippingAddress: {
    type: String,
    default: "Jhapa, Nepal"
  }, 
  role: {
    type: String,
    enum: ['Customer', 'Admin'],
    default: 'Customer'
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
    select: false
  },
  carts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cart'
  }],
  favorites : [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Favorite'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;