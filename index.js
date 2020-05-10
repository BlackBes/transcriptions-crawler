const logger = require('./logger');
const jsdom = require("jsdom");
const request = require('request');
const dictionary = require('./dictionary');
const http = require('http');
let results = {};
let drops = {};

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
const words_max = Object.size(dictionary.words);
//const words_max = 481;
crawl(0);
/*Object.keys(dictionary.words).map(function(objectKey, index) {*/
function crawl(index) {
    if(index in dictionary.words) {
        let value = dictionary.words[index];
        console.log('Working on: ' + value);
        console.log(index + ' from ' + Object.size(dictionary.words));

        setTimeout(() => nextCrawl(index), 200);
        request({
            url: 'http://www.phonemicchart.com/transcribe/?w=' + value
        }, function (error, response, body) {
            if (error) {
                console.log(error);
            } else {
                //console.log('body:', body);
                parseData(value, body);

                //logger.log(body.toString());
            }
        });
    } else {

    }
}
/*});*/

function nextCrawl(index) {
    let newIndex = index + 1;
    crawl(newIndex);
}

function parseData(el_name, html) {
    const {JSDOM} = jsdom;
    const dom = new JSDOM(html);
    const $ = (require('jquery'))(dom.window);    //let's start extracting the data

    let item = $('center');
    console.log($(item).text());
    results[el_name] = $(item).text();

    if($(item).length === 0) {
        drops[Object.size(results)+1] = el_name;
    }

    if(words_max === Object.size(results)) {
        logger.log(JSON.stringify(results));
        logger.dump(JSON.stringify(drops));
        const end = new Date().getTime();
        console.log(`Total execution time: ${(end - start)/1000}s`);
    }
    //logger.log($(item).text() + '\r\n');
}