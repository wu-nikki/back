import { Router } from 'express'

import { getAnimals, getAnimal } from '../controllers/animals.js'

const router = Router()
// console.log(getAllAnimals)
// console.log(getAnimal)
// console.log('editAnimal')
// router.post('/', content('multipart/form-data'), jwt, admin, upload, createAnimal)

router.get('/', getAnimals)
router.get('/:id', getAnimal)

export default router
