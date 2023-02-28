import axios from 'axios'
import animals from '../models/animals.js'
import shelters from '../models/shelters.js'
// 1.建立一個整理過的資料

export default async () => {
  try {
    const sheltersList = await shelters.find()
    // {data} 直接把物件的key是data的取出來

    // 獲取昨天的日期
    const yesterday = new Date(Date.now() - 86400000) // 86400000 為一天的毫秒數
    const yyyy = yesterday.getFullYear() // 取得年份
    const mm = (yesterday.getMonth() + 1).toString().padStart(2, '0') // 取得月份，補齊至兩位數
    const dd = yesterday.getDate().toString().padStart(2, '0') // 取得日期，補齊至兩位數

    // 格式化日期成網址上可使用的格式 (yyyymmdd)
    const formattedDate = `${yyyy}/${mm}/${dd}`
    console.log(formattedDate)
    // 將格式化後的日期加入 API 網址
    const apiUrl = `https://data.coa.gov.tw/Service/OpenData/TransService.aspx?UnitId=QcbUEzN6E6DL&$top=1000&$skip=0&animal_update=${formattedDate}`

    // 發送 API 請求
    const { data } = await axios.get(apiUrl)

    // const { data } = await axios.get('https://data.coa.gov.tw/Service/OpenData/TransService.aspx?UnitId=QcbUEzN6E6DL&$top=1000&$skip=0')

    const msg = data.map(animal => {
      const out = {}
      out.img = animal.album_file
      out.size = animal.animal_bodytype === 'SMALL' ? '小型' : animal.animal_bodytype === 'MEDIUM' ? '中型' : '大型'
      out.color = animal.animal_colour
      out.variety =
        animal.animal_Variety.includes('混種貓') || animal.animal_Variety.includes('混種犬') || animal.animal_Variety.includes('混種狗')
          ? '米克斯'
          : animal.animal_Variety.trim()
      out.gender = animal.animal_sex === 'M' ? '公' : animal.animal_sex === 'F' ? '母' : '未輸入'
      out.kind = animal.animal_kind === '狗' ? '犬' : animal.animal_kind === '貓' ? '貓' : '其他'
      out.opendate = animal.animal_opendate === '' ? '時間未定' : animal.animal_opendate
      out.sterilization = animal.animal_sterilization === 'T' ? '已絕育' : animal.animal_sterilization === 'F' ? '未絕育' : '未輸入'

      out.age = animal.animal_age === 'CHILD' ? '幼年' : animal.animal_age === 'ADULT' ? '成年' : animal.animal_age
      // 收容編號
      out.subid = animal.animal_subid
      // 是否開放認領養
      out.status =
        animal.animal_status === 'OPEN'
          ? '開放認養'
          : animal.animal_status === 'ADOPTED'
            ? '已認養'
            : animal.animal_status === 'OTHER'
              ? '其他'
              : animal.animal_status === 'NONE'
                ? '未公告'
                : '回天堂了..'

      // 公告收容所

      const index = sheltersList.findIndex(item => {
        const find = item.place === animal.shelter_name
        // if (find) { console.log(item, animal, '--') }
        return find || animal.shelter_address.includes(item.add)
      })

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

    const newMeg = msg.filter(item => item.shelterName !== '')

    await animals.create(newMeg)
    console.log('Updated')
    // console.log('animalsdata')
  } catch (err) {
    console.log(err)
    return Error(err)
  }
}
// 先建好models.shelter (資料格式) ，import進 utils.shelterData
// 利用utils.shelterData   裡面的AXIOS去抓資料，並.map資料來加工  再用models.shelter 存進資料庫
