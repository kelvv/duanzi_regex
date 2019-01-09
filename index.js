const request = require('request')
const host = `https://www.neihan8.com`

async function getHtml (url) {
  return new Promise((resolve, reject) => {
    request.get(url, (error, response, body) => {
      if (error) {
        reject(error)
      } else {
        resolve(body)
      }
    })
  })
}

async function begin (url) {
  let linkRegex = /<a\s+href="([^"]+)">/ig
  let isDuanziRegex = /article\/index_\d+.html/ig
  let DuanziRegex = /<a\s*href="([^"]+)"[^>]+>([^<]+)<\/a><\/h3>\s*<div\sclass="desc">\s*([^<>]+)/ig
  let html = await getHtml(url)
  while (true) {
    let links = linkRegex.exec(html)
    if (!links) {
      break
    }
    let url = links[1]
    if (!isDuanziRegex.test(url)) {
      continue
    }

    let duanziHtml = await getHtml(host + url)
    while (true) {
      let duanzis = DuanziRegex.exec(duanziHtml)
      if (!duanzis) {
        break
      }
      console.log(duanzis[3])
    }
    begin(host + url)
  }
}

begin(host + '/article/')
