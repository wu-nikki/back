import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'

import animalData from './utils/animalData.js'
import shelterData from './utils/shelterData.js'
import cors from 'cors'
import userRoute from './routes/users.js'
import animalsRoute from './routes/animals.js'
import orderRoute from './routes/orders.js'

import './passport/passport.js'
mongoose.set('strictQuery', false)
mongoose.set('sanitizeFilter', true)
mongoose.connect(process.env.DB_URL)

const app = express()
shelterData()
animalData()
// 跨域請求設定
app.use(
  cors({
    // origin 代表請求來源，postman等後端的請求會是undefined
    // callback(錯誤, 是否允許)
    origin (origin, callback) {
      // 允許github、localhost， postman等後端的請求會是undefined
      // if (origin.includes('github') || origin.includes('localhost') || origin === undefined) {
      callback(null, true)
      // } else {
      //   // 不允許， 跑至下面的錯誤區
      //   callback(new Error(), false)
      // }
    }
  })
)
// 處理跨域錯誤
app.use((_, req, res, next) => {
  res.status(403).json({ success: false, message: '請求被拒' })
})

app.use(express.json())
app.use((_, req, res, next) => {
  res.status(400).json({ success: false, message: '格式錯誤' })
})

app.use('/users', userRoute)
app.use('/animals', animalsRoute)

app.use('/orders', orderRoute)

app.get('/', (req, res) => {
  res.status(200).json({ success: true, message: '' })
})

app.all('*', (req, res) => {
  res.status(404).json({ success: false, message: '找不到' })
})

app.listen(process.env.PORT || 4000, () => {
  console.log('伺服器啟動')
})
