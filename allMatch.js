const request = require("request");
const cheerio = require("cheerio");
const home = "https://www.espncricinfo.com";
const scoreCardObj = require("./scoreCard");

function getAllMatchlink(link) {
    request(link, function(err, response, html) {
        if(err) {
            console.log(err);
        }
        else {
            extractAllLink(html);
        }
    });
}
function extractAllLink(html) {
    let $ = cheerio.load(html);
    let scoreArray = $('a[data-hover="Scorecard"]');

    for(let i=0; i<scoreArray.length; i++) {
        let link = $(scoreArray[i]).attr("href");
        link = home + link;
        //console.log(link);
        scoreCardObj.ps(link);
    }
}
module.exports = {
    getAllMatch : getAllMatchlink
}