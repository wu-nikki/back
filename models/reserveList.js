import { Schema, model, ObjectId } from 'mongoose'

const schema = new Schema({
  u_id: {
    type: ObjectId,
    ref: 'users',
    required: [true, '缺少使用者']
  },
  shelter: {
    type: [{
      type: ObjectId,
      ref: 'shelters'
    }],
    default: []
  },
  date: {
    type: Date,
    default: Date.now
  }
}, { versionKey: false })
export default model('reserveList', schema)
