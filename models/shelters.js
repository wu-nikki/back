import { model, Schema } from 'mongoose'

const schema = new Schema(
  {
    // 排序
    seq: {
      type: String,
      required: true,
      unique: true
    },

    img: {
      type: [String],
      default: ''
    },
    // 公告收容所
    place: {
      type: String,
      required: [true, '未輸入收容所']
    },
    // 縣市名稱
    cityName: {
      type: String,
      required: [true, '未輸入縣市名稱']
    },
    // 收容所電話
    tel: {
      type: String,
      required: [true, '未輸入收容所電話']
    },
    // 收容所地址
    add: {
      type: String,
      required: [true, '未輸入收容所地址']
    },
    // 開放時間
    openTime: {
      type: String,
      required: [true, '未輸入開放時間']
    },
    // 經度
    lon: {
      type: String,
      required: [true, '未輸入經度']
    },
    // 緯度
    lat: {
      type: String,
      required: [true, '未輸入緯度']
    }
  },
  { versionKey: false }
)
export default model('shelters', schema)
