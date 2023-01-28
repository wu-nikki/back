import { Schema, model, ObjectId, Error } from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcrypt'

const cartSchema = new Schema({
  p_id: {
    type: ObjectId,
    ref: 'products',
    required: [true, '缺少商品']
  },
  quantity: {
    type: Number,
    required: [true, '缺少數量']
  }
})

const schema = new Schema(
  {
    account: {
      type: String,
      required: [true, '缺少帳號'],
      minlength: [4, '帳號太短'],
      maxlength: [20, '帳號太長'],
      unique: true,
      math: [/^[A-Za-z0-9]+$/, '帳號格式錯誤']
    },
    password: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: [true, '缺少信箱'],
      unique: true,
      validator (email) {
        return validator.isEmail(email)
      },
      message: '信箱格式錯誤'
    },
    tokens: {
      type: [String],
      default: []
    },
    cart: {
      type: [cartSchema],
      default: []
    },
    role: {
      type: Number,
      // 0=使用者，1=管理員
      default: 0
    }
  },
  { versionKey: false }
)

schema.pre('save', function (next) {
  const user = this
  if (user.isModified('password')) {
    if (user.password.length >= 4 && user.password.length <= 20) {
      user.password = bcrypt.hashSync(user.password, 10)
    } else {
      const error = new Error.ValidationError(null)
      error.addError('password', new Error.ValidationError({ message: '密碼長度錯誤' }))
      next(error)
      return
    }
  }next()
})

schema.pre('findOneAndUpdate', function (next) {
  const user = this._update
  if (user.password) {
    if (user.password.length >= 4 && user.password.length <= 20) {
      user.password = bcrypt.hashSync(user.password, 10)
    } else {
      const error = new Error.ValidationError(null)
      error.addError('password', new Error.ValidationError({ message: '密碼長度錯誤' }))
      next(error)
      return
    }
  }next()
})

export default model('users', schema)
