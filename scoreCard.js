//team name(2), venue, date, result
const request = require("request");
const cheerio = require("cheerio");
const path = require("path");
const fs = require("fs");
const xlsx = require("xlsx");

//const url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595/mumbai-indians-vs-chennai-super-kings-1st-match-1216492/full-scorecard";
//team -> .match-info.match-info-MATCH.match-info-MATCH-half-width .team .name-detail .name
function processScoreCard(url) {
    request(url, cb);
}


function cb(err, response, html) {
    if(err) {
        console.log(err);
    }
    else {
        extractMatchDetails(html);
    }
}
//.header-info .description
function extractMatchDetails(html) { 
    let $ = cheerio.load(html);
    let descStr = $('.header-info .description');
    let resultOfMatch = $(".match-info.match-info-MATCH.match-info-MATCH-half-width .status-text").text();
    let descStrArr = descStr.text().split(',');
    let venue = descStrArr[1].trim().toUpperCase();
    let date = descStrArr[2].trim().toUpperCase();

    //console.log(`venue is ${venue}, the date is ${date} \n and the winner was ${resultOfMatch}` );
    let innings = $(".card.content-block.match-scorecard-table > .Collapsible");
    // let strHtml = "";

    for(let i=0; i<innings.length; i++) { 
        let teamName = $(innings[i]).find("h5").text();
        teamName = teamName.split("INNINGS")[0].trim();
        let oppIdx = i == 0 ? 1 : 0;
        let oppnontTeam = $(innings[oppIdx]).find("h5").text();
        oppnontTeam = oppnontTeam.split("INNINGS")[0].trim();
        console.log(`${venue} ${date} ${teamName} : ${oppnontTeam} ${resultOfMatch}`);
        let currInnings = $(innings[i]);
        let allRow = currInnings.find(".table.batsman tbody tr");

        for(let j=0; j<allRow.length; j++) {
            let allCol = $(allRow[j]).find("td");

            let isWorthy = $(allCol[0]).hasClass("batsman-cell");
            if(isWorthy) {
                let playerName = $(allCol[0]).text().trim();
                let runs = $(allCol[2]).text().trim();
                let balls = $(allCol[3]).text().trim();
                let foure = $(allCol[5]).text().trim();
                let six = $(allCol[6]).text().trim();
                let stRate = $(allCol[7]).text().trim();
                console.log(`${playerName}: ${runs} : ${balls} : ${foure} : ${six} : ${stRate}`)
                processPlayer(teamName ,playerName,runs, balls, six, foure, stRate, oppnontTeam,
                    venue, date, resultOfMatch);
            }
        }

    }
}

function processPlayer(teamName ,playerName,runs, balls, six, foure, stRate, oppnontTeam,
    venue, date, resultOfMatch) {
        let teamPath = path.join(__dirname, "ipl",teamName);
        dirCreation(teamPath);
        let filePath = path.join(teamPath,playerName +".xlsx");
        let content = exelReader(filePath, playerName);
        let playerObj = {
            teamName,
            playerName,
            runs,
            balls,
            foure,
            six,
            stRate,
            oppnontTeam,
            venue,
            date,
            resultOfMatch
        }
        content.push(playerObj);
        exelWritter(filePath, content, playerName);
}
function dirCreation(filePath) {
    if(fs.existsSync(filePath) == false) {
        fs.mkdirSync(filePath);
    }
}
function exelWritter(FilePath, data,sheetName) {
    let newWB = xlsx.utils.book_new();
    let newWS = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(newWB, newWS, sheetName);
    xlsx.writeFile(newWB, FilePath);
}
function exelReader(filePath, sheetName) {
    if(fs.existsSync(filePath)) {
        let workBook = xlsx.readFile(filePath);
        let exelData = workBook.Sheets[sheetName];
        let ans = xlsx.utils.sheet_to_json(exelData);
        return ans;
    }
    else return [];
}
module.exports = {
    ps : processScoreCard
}
