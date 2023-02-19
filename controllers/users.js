import users from '../models/users.js'
// import animals from '../models/animals.js'
import jwt from 'jsonwebtoken'

export const register = async (req, res) => {
  try {
    await users.create({
      name: req.body.name,
      account: req.body.account,
      password: req.body.password,
      cellPhone: req.body.cellPhone,
      email: req.body.email
    })
    res.status(200).json({ success: true, message: '' })
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(400).json({ success: false, message: error.errors[Object.keys(error.errors)[0]].message })
    } else if (error.name === 'MongoServerError' && error.code === 11000) {
      res.status(400).json({ success: false, message: '帳號重複' })
    } else {
      res.status(500).json({ success: false, message: '未知錯誤' })
    }
  }
}
// 登入
export const login = async (req, res) => {
  try {
    const token = jwt.sign({ _id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '7 days' })
    req.user.tokens.push(token)
    await req.user.save()

    res.status(200).json({
      success: true,
      message: '',
      result: {
        token,
        name: req.user.name,
        account: req.user.account,
        likeAnimalsList: req.user.likeAnimalsList,
        dayList: req.user.dayList,
        role: req.user.role,
        userImg: req.user.userImg
      }
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: '未知錯誤' })
  }
}

// 登出
export const logout = async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(token => token !== req.token)
    await req.user.save()
    res.status(200).json({ success: true, message: '' })
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: '未知錯誤' })
  }
}
// 把舊的jwt更新成新的
export const extend = async (req, res) => {
  try {
    const idx = req.user.tokens.findIndex(token => token === req.token)
    const token = jwt.sign({ _id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '7 days' })
    req.user.tokens[idx] = token
    await req.user.save()
    res.status(200).json({ success: true, message: '', result: token })
  } catch (error) {
    res.status(500).json({ success: false, message: '未知錯誤' })
  }
}
// 使用者
export const getAllUser = async (req, res) => {
  try {
    const result = await users.find()
    res.status(200).json({ success: true, message: '', result })
  } catch (error) {
    res.status(500).json({ success: false, message: '未知錯誤' })
  }
}

// 使用者
export const getUser = async (req, res) => {
  try {
    const result = await users.findById(req.user._id)
    res.status(200).json({
      success: true,
      message: '',
      result
      // : {
      //   userImg: req.user.userImg,
      //   name: req.user.name,
      //   account: req.user.account,
      //   cellPhone: req.user.cellPhone,
      //   email: req.user.email,
      //   birthday: req.user.birthday,
      //   likeAnimalsList: req.user.likeAnimalsList,
      //   dayList: req.user.dayList,
      //   role: req.user.role
      // }
    })
  } catch (error) {
    console.log(error)

    res.status(500).json({ success: false, message: '未知錯誤' })
  }
}
// 會員管理

export const editUser = async (req, res) => {
  try {
    let imagePath = ''

    if (req.files.userImg?.length > 0) {
      imagePath = req.files.userImg[0].path
    }

    if (typeof req.body.userImg === 'string') {
      imagePath = req.body.userImg
    }
    if (typeof req.body.userImg === 'object') {
      req.body.userImg.forEach(item => {
        if (item !== '' && item !== undefined && item !== null) {
          imagePath = item
        }
      })
    }
    //
    const result = await users.findByIdAndUpdate(req.user._id, {
      _id: req.body._id,
      userImg: imagePath,
      name: req.body.name,
      account: req.body.account,
      cellPhone: req.body.cellPhone,
      email: req.body.email,
      birthday: req.body.birthday || ''
    })

    if (!result) {
      res.status(404).json({ success: false, message: '找不到' })
    } else {
      res.status(200).json({ success: true, message: '', result })
    }
  } catch (error) {
    console.log(error)
    if (error.name === 'ValidationError') {
      res.status(400).json({ success: false, message: error.errors[Object.keys(error.errors)[0]].message })
    } else if (error.name === 'CastError') {
      res.status(404).json({ success: false, message: '找不到' })
    } else {
      res.status(500).json({ success: false, message: '未知錯誤' })
    }
  }
}

// 編輯會員資料

export const editUsers = async (req, res) => {
  try {
    const result = await users.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        account: req.body.account,
        cellPhone: req.body.cellPhone,
        email: req.body.email,
        birthday: req.body.birthday || ''
      },
      { new: true }
    )

    if (!result) {
      res.status(404).json({ success: false, message: '找不到' })
    } else {
      res.status(200).json({ success: true, message: '', result })
    }
  } catch (error) {
    console.log(error)
    if (error.name === 'ValidationError') {
      res.status(400).json({ success: false, message: error.errors[Object.keys(error.errors)[0]].message })
    } else if (error.name === 'CastError') {
      res.status(404).json({ success: false, message: '找不到' })
    } else {
      res.status(500).json({ success: false, message: '未知錯誤' })
    }
  }
}

// -----------------------------

// 增加至毛孩收藏
export const addLikeAnimalsList = async (req, res) => {
  try {
    const idx = req.user.likeAnimalsList.findIndex(animalId => animalId.toString() === req.params.id)
    if (idx >= 0) {
      return res.status(400).json({ success: false, message: '已增加到收藏' })
    }
    req.user.likeAnimalsList.push(req.params.id)
    await req.user.save()
    res.status(200).json({ success: true, message: '', result: '' })
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: '未知錯誤' })
  }
}
// 將這毛孩的毛孩收藏刪除
export const deleteLikeAnimalsList = async (req, res) => {
  try {
    const idx = req.user.likeAnimalsList.findIndex(animalId => animalId.toString() === req.params.id)
    if (idx < 0) {
      return res.status(400).json({ success: false, message: '已刪除' })
    }
    req.user.likeAnimalsList.splice(idx, 1)
    await req.user.save()
    res.status(200).json({ success: true, message: '', result: '' })
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: '未知錯誤' })
  }
}

// 取毛孩收藏
export const getLikeAnimalsList = async (req, res) => {
  try {
    const result = await users.findById(req.user._id, 'likeAnimalsList').populate({ path: 'likeAnimalsList', populate: { path: 'shelterName', select: 'place' } })
    console.log(result)
    const addLovedLikeAnimalsList = result.likeAnimalsList.map(a => {
      const newO = JSON.parse(JSON.stringify(a))
      newO.loved = true
      return newO
    })

    res.status(200).json({ success: true, message: '', result: addLovedLikeAnimalsList })
  } catch (error) {
    console.log(error)

    res.status(500).json({ success: false, message: '取不到毛孩收藏' })
  }
}
