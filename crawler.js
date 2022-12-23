const { JSDOM } = require('jsdom')

function normalizeURL(url) {
    const urlObj = new URL(url)
    let fullPath = `${urlObj.host}${urlObj.pathname}`
    if (fullPath.length > 0 && fullPath.slice(-1) === '/'){
      fullPath = fullPath.slice(0, -1)
    }
    return fullPath
}
function getURLsFromHTML(htmlBody, baseURL) {
  const urls = []
  const dom = new JSDOM(htmlBody)
  const links = dom.window.document.querySelectorAll('a')

  links.forEach(element => {
    if (element.href.slice(0,1) === '/') {
      try {
        urls.push(new URL(element.href, baseURL).href)
      } catch (err){
        console.log(`${err.message}: ${element.href}`)
      }
    } else {
      try {
        urls.push(new URL(element.href).href)
      } catch (err){
        console.log(`${err.message}: ${element.href}`)
      }
    }
  });
  return urls
}

async function crawlPage(base_url, url, pages) {
  const baseUrlObj = new URL(base_url)
  const currentUrlObj = new URL(url)
  // const sameDomain = url.includes(base_url)||url.slice(-1)[0] === base_url[0]
  const notSameDomain = currentUrlObj.hostname !== baseUrlObj.hostname
  if (notSameDomain) {
    return pages
  }  
  const normalUrl = normalizeURL(url) 
 // if we've already visited this page
  // just increase the count and don't repeat
  // the http request
  if (pages[normalUrl] > 0){
    pages[normalUrl]++
    return pages
  }

  // initialize this page in the map
  // since it doesn't exist yet
  pages[normalUrl] = 1

  console.log(`Crawling ${url}`)
  const htmlBody = await getHtmlBody(url, pages)  
  const nextURLs = getURLsFromHTML(htmlBody, base_url)
  for (const nextURL of nextURLs){
    pages = await crawlPage(base_url, nextURL, pages)
  }

  return pages
}

async function getHtmlBody(url, pages) {
  const response = await fetch(url).then(async (response)=>{
    if (response.status !== 200) {
      console.log(`Got HTTP error, status code: ${response.status}`)
      return pages
    }
    const contentType = response.headers.get('content-type')
    if (!contentType.includes('text/html')) {
      console.log(`Got non-html response: ${contentType}`)
      return pages
    }    
    return await response.text()
  }).catch(err => {
    console.log(err.message)
  })
  return response
}

module.exports = {
    normalizeURL,
    getURLsFromHTML,
    crawlPage
}