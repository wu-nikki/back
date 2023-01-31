import axios from 'axios'
import animals from '../models/animals.js'
import shelters from '../models/shelters.js'
// 1.建立一個整理過的資料

export default async () => {
  try {
    const sheltersList = await shelters.find()
    // {data} 直接把物件的key是data的取出來
    const { data } = await axios.get('https://data.coa.gov.tw/Service/OpenData/TransService.aspx?UnitId=QcbUEzN6E6DL&$top=15&$skip=0')

    const msg = data.map(animal => {
      const out = {}
      out.img = animal.album_file
      out.size = animal.animal_bodytype === 'SMALL' ? '小型' : (animal.animal_bodytype === 'MEDIUM' ? '中型' : '大型')
      out.color = animal.animal_colour
      out.variety = (animal.animal_Variety.includes('混種貓') || (animal.animal_Variety.includes('混種犬')) || (animal.animal_Variety.includes('混種狗'))) ? '米克斯' : animal.animal_Variety.trim()
      out.gender = animal.animal_sex === 'M' ? '公' : (animal.animal_sex === 'F' ? '母' : '未輸入')
      out.kind = animal.animal_kind === '狗' ? '犬' : (animal.animal_kind === '貓' ? '貓' : '其他')
      out.opendate = animal.animal_opendate === '' ? '時間未定' : animal.animal_opendate
      out.sterilization = animal.animal_sterilization === 'T' ? '已絕育' : (animal.animal_sterilization === 'F' ? '未絕育' : '未輸入')

      out.age = animal.animal_age === 'CHILD' ? '幼年' : animal.animal_age === 'ADULT' ? '成年' : animal.animal_age
      // 收容編號
      out.subid = animal.animal_subid
      // 是否開放認領養
      out.status = animal.animal_status === 'OPEN' ? '開放認養' : animal.animal_status === 'ADOPTED' ? '已認養' : animal.animal_status === 'OTHER' ? '其他' : animal.animal_status === 'NONE' ? '未公告' : '回天堂了..'

      // 公告收容所

      const index = sheltersList.findIndex(
        (item) => {
          const find = (item.place === animal.shelter_name)
          // if (find) { console.log(item, animal, '--') }
          return (find) || (animal.shelter_address.includes(item.add))
        }
      )

      if (index !== -1) {
        out.shelterName = sheltersList[index]._id
      } else {
        // console.log(animal)
        out.shelterName = ''
      }

      // 描述
      out.remark = animal.animal_remark === '' ? '---' : animal.animal_remark
      return out
    })

    const newMeg = msg.filter((item) => item.shelterNamed !== '')

    const result = await animals.create(newMeg)
    console.log(result)
  } catch (err) {
    console.log(err)
    return Error(err)
  }
}
