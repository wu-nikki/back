import { Router } from 'express'
import content from '../middleware/content.js'
import admin from '../middleware/admin.js'
import upload from '../middleware/upload.js'
import { jwt } from '../middleware/auth.js'
import { getAnimals, getAnimal, editAnimal } from '../controllers/animals.js'

const router = Router()
// console.log(getAllAnimals)
// console.log(getAnimal)
// console.log('editAnimal')
// router.post('/', content('multipart/form-data'), jwt, admin, upload, createAnimal)

router.get('/', getAnimals)
router.get('/:id', getAnimal)
router.patch('/:id', content('multipart/form-data'), jwt, admin, upload, editAnimal)

export default router
