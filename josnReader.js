// to rread the json file we can do ->
const fs = require("fs");
const xlsx = require("xlsx");
// let buffer = fs.readFileSync("./exampleJSON.json");
// console.log(buffer);
// console.log("------------------------------------------------------");
// let data = JSON.parse(buffer);
// console.log(data);
// another way of doing this is
//just require the json file and stringfy it
const jsonData = require("./exampleJSON.json");
//jsonData is an array
//we can perform all the array operation
jsonData.push({
    
        "name" : "Karuna",
        "Middle Name" : "K",
        "last name" : "Rashinkar",
        "age" : "25"
    
});
// let stringData = JSON.stringify(jsonData);
// fs.writeFileSync("./exampleJSON.json", stringData);
// console.log("check the file");

//creates new workbook;
function exelWritter(FilePath, data,sheetName) {
    let newWB = xlsx.utils.book_new();
    let newWS = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(newWB, newWS, sheetName);
    xlsx.writeFile(newWB, FilePath);
}
function exelReader(filePath, sheetName) {
    if(fs.existsSync(filePath)) {
        let workBook = xlsx.readFile(filePath);
        let exelData = workBook.Sheets(sheetName);
        let ans = xlsx.utils.sheet_to_json(exelData);
        return;
    }
    else return [];
}


