function printReport(pages) {
    console.log("==========================")
    console.log("====== Report Start ======")
    console.log("==========================")

    const sortedPages = sortPages(pages)
    for (const page of sortedPages) {
        const url = page[0]
        const count = page[1]
        console.log(`Found ${count} internal links in ${url}`)
    }
    console.log("===========================")
    console.log("====== End of Report ======")
    console.log("===========================")
}
function sortPages(pages) {
    const sortable = Object.entries(pages)
    sortable.sort(function(a, b) {
        return b[1] - a[1];
    })
    return sortable
}
module.exports = {
    printReport
}