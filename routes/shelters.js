import { Router } from 'express'
import content from '../middleware/content.js'
import admin from '../middleware/admin.js'
import { upload5Img } from '../middleware/upload.js'
import { jwt } from '../middleware/auth.js'
import { getShelters, getShelter, editshelter } from '../controllers/shelters.js'
const router = Router()

router.get('/', getShelters)
router.get('/:id', getShelter)

router.patch('/:id', content('multipart/form-data'), jwt, admin, upload5Img, editshelter)

export default router
