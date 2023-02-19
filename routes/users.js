import { Router } from 'express'
import content from '../middleware/content.js'
import admin from '../middleware/admin.js'
// import { jwt } from '../middleware/auth.js'
import { uploadUserImg } from '../middleware/upload.js'

import * as auth from '../middleware/auth.js'
import {
  register,
  login,
  logout,
  extend,
  getAllUser,
  getUser,
  editUser,
  editUsers,
  addLikeAnimalsList,
  deleteLikeAnimalsList,
  getLikeAnimalsList
} from '../controllers/users.js'

const router = Router()
// 註冊
router.post('/', content('application/json'), register)

// 登入
router.post('/login', content('application/json'), auth.login, login)

// 登出
router.delete('/logout', auth.jwt, logout)
// 把舊的jwt更新成新的
router.patch('/extend', auth.jwt, extend)

// 全部使用者
router.get('/', auth.jwt, getAllUser)

// 使用者
router.get('/me', auth.jwt, getUser)
//  會員管理自己的資料
router.patch('/me', content('multipart/form-data'), auth.jwt, uploadUserImg, editUser)

// 編輯會員資料
router.patch('/:id', content('multipart/form-data'), auth.jwt, admin, uploadUserImg, editUsers)

// ----------------------------------------------

// 刪除
router.delete('/likeAnimalsList/:id', auth.jwt, deleteLikeAnimalsList)
// 增加
router.post('/likeAnimalsList/:id', auth.jwt, addLikeAnimalsList)

// 取毛孩收藏
router.get('/likeAnimalsList', auth.jwt, getLikeAnimalsList)

export default router
