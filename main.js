const { crawlPage } = require("./crawler")
const { printReport } = require("./report")

async function main() {
    const agrsLength = process.argv.length
    if (agrsLength < 3 || agrsLength > 3) {
        console.log(`Error: Expected one argument, but given ${agrsLength - 2} argument`)
        return 0
    }
    const BASE_URL = process.argv.slice(2)
    console.log(`Starting crawl this ${BASE_URL}`)
    const pages = await crawlPage(BASE_URL, BASE_URL, {})
    // console.log(pages)
    printReport(pages)
}

main()