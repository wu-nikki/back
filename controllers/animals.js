import animals from '../models/animals.js'
import axios from 'axios'
export const createAnimal = async (req, res) => {
  try {
    // 1.建立一個整理過的資料
    let todayData
    const init = async () => {
      try {
        // {data} 直接把物件的key是data的取出來
        const { data } = await axios.get('https://data.coa.gov.tw/Service/OpenData/TransService.aspx?UnitId=QcbUEzN6E6DL&$top=5&$skip=0')
        const msg = data.map(animal => {
          const out = {}
          out.img = animal.album_file
          out.size = animal.animal_bodytype === 'SMALL' ? '小型' : (animal.animal_bodytype === 'MEDIUM' ? '中型' : '大型')
          out.color = animal.animal_colour
          out.variety = (animal.animal_Variety.includes('混種貓') || (animal.animal_Variety.includes('混種犬')) || (animal.animal_Variety.includes('混種狗'))) ? '米克斯' : animal.animal_Variety.trim()
          out.gender = animal.animal_sex === 'M' ? '公' : (animal.animal_sex === 'F' ? '母' : '未輸入')
          out.kind = animal.animal_kind === '狗' ? '犬' : (animal.animal_kind === '貓' ? '貓' : '其他')
          out.opendate = animal.animal_opendate === '' ? '時間未定' : animal.animal_opendate
          out.sterilization = animal.animal_sterilization === 'T' ? '已絕育' : (animal.animal_sterilization === 'F' ? '未絕育' : '未輸入')

          out.age = animal.animal_age
          // 收容編號
          out.subid = animal.animal_subid
          // 是否開放認領養
          out.status = animal.animal_status === 'OPEN' ? '開放認養' : animal.animal_status === 'ADOPTED' ? '已認養' : animal.animal_status === 'OTHER' ? '其他' : animal.animal_status === 'NONE' ? '未公告' : '回天堂了..'
          // 公告收容所
          out.shelterName = animal.shelter_name
          // 描述
          out.remark = animal.animal_remark === '' ? '---' : animal.animal_remark
          return out
        })
        todayData = animals.create(msg)
      } catch (err) {
        return Error(err)
      }
    }
    init()

    // const result = await animals.create({
    //   name: req.body.name,
    //   price: req.body.price,
    //   description: req.body.description,
    //   // 如果圖片沒檔案就傳空值
    //   image: req.file?.path || '',
    //   sell: req.body.sell,
    //   category: req.body.category
    // })
    res.status(200).json({ success: true, message: '', init })
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(400).json({ success: false, message: error.errors[Object.keys(error.errors)[0]].message })
    } else {
      res.status(500).json({ success: false, message: '未知錯誤' })
    }
  }
}

// 商品狀態
// 已上架
export const getSellAnimals = async (req, res) => {
  try {
    const result = await animals.find({ sell: true })
    res.status(200).json({ success: true, message: '', result })
  } catch (error) {
    res.status(500).json({ success: false, message: '未知錯誤' })
  }
}

// 全部商品
export const getAllAnimals = async (req, res) => {
  try {
    const result = await animals.find()
    res.status(200).json({ success: true, message: '', result })
  } catch (error) {
    res.status(500).json({ success: false, message: '未知錯誤' })
  }
}

// 商品
export const getAnimal = async (req, res) => {
  try {
    const result = await animals.findById(req.params.id)
    if (!result) {
      res.status(404).json({ success: false, message: '找不到' })
    } else {
      res.status(200).json({ success: true, message: '', result })
    }
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(404).json({ success: false, message: '找不到' })
    } else {
      res.status(500).json({ success: false, message: '未知錯誤' })
    }
  }
}

// 刪除商品
export const editAnimal = async (req, res) => {
  try {
    const result = await animals.findByIdAndUpdate(req.params.id, {
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      image: req.file?.path,
      sell: req.body.sell,
      category: req.body.category
    }, { new: true })
    if (!result) {
      res.status(404).json({ success: false, message: '找不到' })
    } else {
      res.status(200).json({ success: true, message: '', result })
    }
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(400).json({ success: false, message: error.errors[Object.keys(error.errors)[0]].message })
    } else if (error.name === 'CastError') {
      res.status(404).json({ success: false, message: '找不到' })
    } else {
      res.status(500).json({ success: false, message: '未知錯誤' })
    }
  }
}
