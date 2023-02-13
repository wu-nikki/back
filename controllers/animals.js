import animals from '../models/animals.js'
import shelters from '../models/shelters.js'
// .populate(關聯資料路徑, 取的欄位)
// .populate('products.p_id').populate('u_id', 'account')
// .populate({ path: 'shelterName', select: 'cityName' })
//
// 全部動物

export const getAnimals = async (req, res) => {
  try {
    const result = await animals.find().populate({ path: 'shelterName', select: 'place' })
    // .populate('shelters.place')
    // .populate({ path: 'shelterName', select: 'place' })
    // console.log(result)

    res.status(200).json({ success: true, message: '', result })
  } catch (error) {
    res.status(500).json({ success: false, message: '未知錯誤' })
    console.log(error)
  }
}

// 個別動物
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
