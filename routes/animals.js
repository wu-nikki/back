import { Router } from 'express'
import content from '../middleware/content.js'
import admin from '../middleware/admin.js'
import upload from '../middleware/upload.js'
import { jwt } from '../middleware/auth.js'
import { getAllAnimals, getAnimal, editAnimal } from '../controllers/animals.js'

const router = Router()

// router.post('/', content('multipart/form-data'), jwt, admin, upload, createAnimal)
// router.get('/', getSellAnimals)
router.get('/all', jwt, admin, getAllAnimals)
router.get('/:id', getAnimal)
router.patch('/:id', content('multipart/form-data'), jwt, admin, upload, editAnimal)

export default router
