const logger = require('./logger');
const jsdom = require("jsdom");
const request = require('request');
const dictionary = require('./dictionary');
const http = require('http');
let results = {};

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}
const start= new Date().getTime();
crawl(1);
/*Object.keys(dictionary.words).map(function(objectKey, index) {*/
function crawl(index) {
    if(index in dictionary.words) {
        let value = dictionary.words[index];
        console.log('Working on: ' + value);
        console.log(index + ' from ' + Object.size(dictionary.words));

        request({
            url: 'http://www.phonemicchart.com/transcribe/?w=' + value
        }, function (error, response, body) {
            if (error) {
                console.log(error);
            } else {
                //console.log('body:', body);
                parseData(value, body);
                let newIndex = index + 1;
                crawl(newIndex);
                //logger.log(body.toString());
            }
        });
    } else {
        logger.log(JSON.stringify(results));
        const end = new Date().getTime();
        console.log(`Total execution time: ${(end - start)/1000}s`);
    }
}
/*});*/


function parseData(el_name, html) {
    const {JSDOM} = jsdom;
    const dom = new JSDOM(html);
    const $ = (require('jquery'))(dom.window);    //let's start extracting the data

    let item = $('center');
    console.log($(item).text());
    results[el_name] = $(item).text();
    //logger.log($(item).text() + '\r\n');
}