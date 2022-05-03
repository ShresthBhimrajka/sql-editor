//This file is used to retrieve the mock data from the json files

export default function getData (table) {
    let rawFile = null;
    if(table > 3) {
        table = Math.floor(Math.random() * 3);
    }
    if(table === 1) {
        rawFile = require('./customers.json');
    } else if(table === 2) {
        rawFile = require('./categories.json');
    } else if(table === 3) {
        rawFile = require('./products.json');
    }
    let headers = [];
    let rows = [];
    for(var i = 0 ; i < rawFile.length ; i++) {
        const row = rawFile[i]
        if(i === 0) {
            for(const item in row) {
                headers.push(row[item]);
            }
        } else {
            let temp = [];
            for(const item in row) {
                temp.push(row[item]);
            }
            rows.push(temp);
        }
    }
    return {headers, rows};
}