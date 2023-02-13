import shelters from '../models/shelters.js'

export const getShelters = async (req, res) => {
  try {
    const result = await (await shelters.find().sort(String(shelters.seq))).reverse()
    // console.log(result)
    res.status(200).json({ success: true, message: '', result })
  } catch (error) {
    res.status(500).json({ success: false, message: '未知錯誤' })
    console.log(error)
  }
}

// 個別收容所
export const getShelter = async (req, res) => {
  try {
    const result = await shelters.findById(req.params.id)

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

// 編輯收容所
export const editshelter = async (req, res) => {
  try {
    const result = await shelters.findByIdAndUpdate(
      req.params.id,
      {
        seq: req.body.seq,
        img: req.file?.path || '',
        place: req.body.place,
        cityName: req.body.cityName,
        tel: req.body.tel,

        add: req.body.add,
        openTime: req.body.openTime,
        lon: req.body.lon,
        lat: req.body.lat

      },
      { new: true }
    )
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
