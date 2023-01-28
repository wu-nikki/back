// 商品
export default (req, res, next) => {
  // 判斷是不是管理員
  if (req.user.role !== 1) {
    res.status(403).json({ success: false, message: '沒有權限' })
  } else {
    next()
  }
}
