import animals from '../models/animals.js'
import shelters from '../models/shelters.js'
import users from '../models/users.js'
// .populate(關聯資料路徑, 取的欄位)
// .populate('products.p_id').populate('u_id', 'account')
// .populate({ path: 'shelterName', select: 'cityName' })
//
// 全部動物

export const getAnimals = async (req, res) => {
  try {
    const result = await animals.find().populate({ path: 'shelterName', select: 'place' })
    const likeAnimalsList = await getLikeAnimalsList(req.user_id)
    const out = result.map(a => {
      const addLovedAninal = JSON.parse(JSON.stringify(a))
      addLovedAninal.loved = checkAnimalInList(a._id.toString(), likeAnimalsList)
      return addLovedAninal
    })
    // js 陣列中物件修改必須這樣
    // const newArr = Arr.map(o => {
    //   const newO = JSON.parse(JSON.stringify(o))
    //   newO.add = true
    //   return newO
    // })
    res.status(200).json({ success: true, message: '', result: out })
  } catch (error) {
    res.status(500).json({ success: false, message: '未知錯誤' })
    console.log(error)
  }
}

// 個別動物
export const getAnimal = async (req, res) => {
  try {
    const result = await animals.findById(req.params.id).populate({ path: 'shelterName' })
    if (!result) {
      return res.status(404).json({ success: false, message: '找不到' })
    }
    const likeAnimalsList = await getLikeAnimalsList(req.user_id)
    const out = JSON.parse(JSON.stringify(result))
    out.loved = checkAnimalInList(req.params.id, likeAnimalsList)
    res.status(200).json({ success: true, message: '', result: out })
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(404).json({ success: false, message: '找不到' })
    } else {
      res.status(500).json({ success: false, message: '未知錯誤' })
    }
  }
}

async function getLikeAnimalsList (userId) {
  try {
    const user = await users.findById(userId, 'likeAnimalsList')
    return user.likeAnimalsList.map(a => a.toString())
  } catch (error) {
    return []
  }
}
function checkAnimalInList (idString, likeAnimalsList) {
  return (
    likeAnimalsList.findIndex(likedAnimal => {
      return likedAnimal === idString
    }) >= 0
  )
}
