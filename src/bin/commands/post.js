import { readFileSync } from 'fs'
import { jqt } from 'rqt'
import { inspect } from 'util'
import { confirm } from 'reloquent'

export default async function post(url, file, path) {
  if (!path) throw new Error('Please pass the path with -p flag.')
  const data = JSON.parse(readFileSync(file, 'utf8'))
  const p = /^https?:\/\//.test(url) ? url : `http://${url}`
  const pp = `${p}/${path}`
  console.log(`Posting data to ${pp}\n`, inspect(data, { colors: true }))
  const y = await confirm('Continue?')
  if (!y) return
  const res = await jqt(pp, {
    method: 'POST',
    data,
  })
  if (res.error) throw new Error(res.error)
  console.log(res)
}