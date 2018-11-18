/* yarn example/ */
import logarithm from '../src'

(async () => {
  const res = await logarithm({
    text: 'example',
  })
  console.log(res)
})()