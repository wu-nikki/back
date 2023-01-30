import { Router } from 'express'
import content from '../middleware/content.js'
import * as auth from '../middleware/auth.js'
import { register, login, logout, extend, getUser, editCart, getCart } from '../controllers/users.js'

const router = Router()
// 註冊
router.post('/', content('application/json'), register)

// 登入
router.post('/login', content('application/json'), auth.login, login)

// 登出
router.delete('/logout', auth.jwt, logout)
// 把舊的jwt更新成新的
router.patch('/extend', auth.jwt, extend)
// 使用者
router.get('/me', auth.jwt, getUser)
// 購物車
router.post('/cart', content('application/json'), auth.jwt, editCart)
// 取得購物車
router.get('/cart', auth.jwt, getCart)
export default router
