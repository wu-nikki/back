import { Schema, model, Error, ObjectId } from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcrypt'

const schema = new Schema(
  {
    // 圖片
    userImg: {
      type: [String]
    },
    // 名稱
    name: {
      type: String,
      required: [true, '缺少名稱']
    },
    // 帳號
    account: {
      type: String,
      required: [true, '缺少帳號'],
      minlength: [4, '帳號太短'],
      maxlength: [20, '帳號太長'],
      unique: true,
      math: [/^[A-Za-z0-9]+$/, '帳號格式錯誤']
    },
    // 密碼
    password: {
      type: String,
      required: true
    },
    cellPhone: {
      type: String,
      required: [true, '缺少手機號碼'],
      unique: true,
      minlength: [10, '手機號碼要10碼'],
      maxlength: [10, '手機號碼要10碼'],
      math: [/^[0-9]+$/, '手機號碼錯誤']
    },
    // 電子信箱
    email: {
      type: String,
      required: [true, '缺少信箱'],
      unique: true,
      // 驗證格式
      validator (email) {
        return validator.isEmail(email)
      },
      message: '信箱格式錯誤'
    },
    birthday: {
      type: Date
    },
    tokens: {
      type: [String],
      // 預設箱子給裝資料
      default: []
    },
    // 毛孩清單
    likeAnimalsList: {
      type: [{
        type: ObjectId,
        ref: 'animals'
      }],
      // 預設箱子給裝資料
      default: []
    },
    // 預約清單
    dayList: {
      type: [String],
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
  }
  next()
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
  }
  next()
})

export default model('users', schema)
