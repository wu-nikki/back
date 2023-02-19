export default (req, res, next) => {
  try {
    if (req.headers?.authorization?.split(' ').length >= 2) {
      const jwt = req.headers?.authorization?.split(' ')[1]
      const userInfoBase64 = jwt.split('.')[1]
      const userInfo = Buffer.from(userInfoBase64, 'base64').toString('ascii')
      const userID = JSON.parse(userInfo)._id
      req.user_id = userID
    }
  } finally {
    next()
  }
}
