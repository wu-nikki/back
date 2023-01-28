// 驗證
// 1.這樣會沒有彈性
// export default (req, res, next) => {
//   if (!req.headers['content-type'] || !req.headers['content-type'].includes('application / json')) {
//     res.status(400).json({ success: false, message: '格式錯誤' })
//     return
//   }next()
// }

export default (type) => {
  return (req, res, next) => {
    if (!req.headers['content-type'] || !req.headers['content-type'].includes(type)) {
      res.status(400).json({ success: false, message: '格式錯誤' })
      return
    }
    next()
  }
}
