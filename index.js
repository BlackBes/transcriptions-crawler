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

const start= new Date().getTime();
//const words_max = Object.size(dictionary.words);

const words_max = 100;
const start_index = 300;

crawl(start_index);
function crawl(index) {
    if(index in dictionary.words && index < start_index+words_max) {
        let value = dictionary.words[index];
        console.log('Working on: ' + value);
        console.log(index + ' from ' + Object.size(dictionary.words));

        setTimeout(() => nextCrawl(index), 200);
        request({
            url: 'https://www.wordhippo.com/what-is/sentences-with-the-word/' + value+'.html'
        }, function (error, response, body) {
            if (error) {
                console.log(error);
            } else {
                parseData(value, body);
                logger.dump(body);
                //
            }
        });
    } else {

    }
}

function nextCrawl(index) {
    let newIndex = index + 1;
    crawl(newIndex);
}

function parseData(el_name, html) {
    const {JSDOM} = jsdom;
    const dom = new JSDOM(html);
    const $ = (require('jquery'))(dom.window);
    let sentences = [];
    let items = $('#mainsentencestable').children('tbody').children('tr');
    $.each(items, function (i, el) {
        let data_block = $(el).children('td')[0];
        let text = $(data_block).text();
        if(!text.includes('\n\nShow More Sentences\n\n\n')) {
            sentences.push($(data_block).text());
        }
    });
    results[el_name] = sentences; //.slice(0, 9);

    if(words_max === Object.size(results)) {
        logger.log(JSON.stringify(results));
        const end = new Date().getTime();
        console.log(`Total execution time: ${(end - start)/1000}s`);
    }
}