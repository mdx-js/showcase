const captureWebsite = require('capture-website')
const pLimit = require('p-limit')

const limit = pLimit(1)

const sites = require('./sites.json')

const options = {
  width: 1920,
  height: 1000,
  overwrite: true
}

const urls = sites
  .filter(site => site.id)
  .reduce((acc, site) => {
    return acc.concat([
      [site.url, site.id],
      [site.secondaryUrl, `${site.id}-2`]
    ])
  }, [])

const captures = urls.map(([url, filename]) => {
  return limit(async () => {
    console.log(`Capturing ${url}`)
    await captureWebsite.file(url, `images/${filename}.png`, options)
    console.log(`  ${url} written to ${filename}`)
  })
})

;(async () => {
  console.log('Beginning screenshots')
  await Promise.all(captures)
  console.log('Finished screenshots')
})
