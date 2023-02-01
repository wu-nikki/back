import animals from '../models/animals.js'

// 商品狀態

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

// 編輯商品
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
