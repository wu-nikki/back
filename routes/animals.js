import { Router } from 'express'
import getUserID from '../middleware/getUserID.js'
import { getAnimals, getAnimal } from '../controllers/animals.js'

const router = Router()
// console.log(getAllAnimals)
// console.log(getAnimal)
// console.log('editAnimal')
// router.post('/', content('multipart/form-data'), jwt, admin, upload, createAnimal)

router.get('/', getUserID, getAnimals)
router.get('/:id', getUserID, getAnimal)

export default router
