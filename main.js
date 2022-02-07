const request = require("request");
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");
//const chalk = require("chalk");
const { hrtime } = require("process");
const url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595";
const home = "https://www.espncricinfo.com";
const allMatchObj = require("./allMatch");

const iplPath = path.join(__dirname, "ipl");
dirCreation(iplPath);

request(url, cb);

function cb(err, response, html) {
    if(err) {
        console.log(err);
    }
    else {
        extractLink(html);
    }
}

function extractLink(html) {
    let $ = cheerio.load(html);
    let anchorEle = $('a[data-hover="View All Results"]');
    
    let link = anchorEle.attr("href");
    link = home + link;
    //console.log(link);
    allMatchObj.getAllMatch(link);
}
function dirCreation(filePath) {
    if(fs.existsSync(filePath) == false) {
        fs.mkdirSync(filePath);
    }
}

