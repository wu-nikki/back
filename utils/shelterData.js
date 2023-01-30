import axios from 'axios'
import shelters from '../models/shelters.js'
// 1.建立一個整理過的資料

export default async () => {
  try {
    // {data} 直接把物件的key是data的取出來
    const { data } = await axios.get('https://data.coa.gov.tw/Service/OpenData/TransService.aspx?UnitId=2thVboChxuKs')
    const msg = data.map(shelter => {
      const out = {}
      out.place = shelter.ShelterName
      out.cityName = shelter.CityName
      out.tel = shelter.Phone
      out.add = shelter.Address
      out.openTime = shelter.OpenTime
      out.lon = shelter.Lon
      out.lat = shelter.Lat

      return out
    })
    console.log(msg)
    await shelters.insertMany(msg)
  } catch (err) {
    console.log(err)
    return Error(err)
  }
}
