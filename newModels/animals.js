import { model, Schema, ObjectId } from 'mongoose'

const place = new Schema({
  place_id: {
    type: ObjectId,
    ref: 'shelter',
    required: [true, '缺少place_id']
  }
})

const schema = new Schema({
  img: {
    type: String
  },
  // 體型
  size: {
    type: String,
    default: '未輸入體型'
  },
  // 毛色
  color: {
    type: String,
    default: '未輸入毛色'
  },
  // 動物品種
  variety: {
    type: String,
    default: '---'
  },
  // 動物性別
  gender: {
    type: String,
    default: '未輸入性別'
  },
  // 動物類別
  kind: {
    type: String,
    default: '未輸入類別',
    enum: {
      values: ['貓', '狗', '其他', '未輸入類別'],
      message: '類別錯誤'
    }
  },
  // 入所日期
  opendate: {
    type: String,
    default: '未輸入日期'
  },
  // 是否絕育
  sterilization: {
    type: String,
    default: '未知是否絕育'
  },
  // 年齡
  age: {
    type: String,
    default: '未知年齡'
  },
  // 收容編號
  subid: {
    type: String,
    required: [true, '未輸入收容編號']
  },
  // 是否開放認領養
  status: {
    type: String,
    default: '未輸入'
  },
  // 公告收容所
  ShelterName: {
    type: [place],
    default: []
  }
}, { versionKey: false })
export default model('animals', schema)
