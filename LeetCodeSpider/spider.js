const puppeteer = require('puppeteer');

var datas = [
    ['1', 'Two Sum', 'Easy'],
    ['2', 'Add Two Numbers', 'Medium'],
    ['3',
        'Longest Substring Without Repeating Characters',
        'Medium'
    ],
    ['4', 'Median of Two Sorted Arrays', 'Hard'],
    ['5', 'Longest Palindromic Substring', 'Medium'],
    ['6', 'ZigZag Conversion', 'Medium'],
    ['7', 'Reverse Integer', 'Easy']
]

const LEFT_ALIGN = ":---",
    CENTER_ALIGN = 1,
    RIGHT_ALIGN = 2;
var heads = {
    "#": CENTER_ALIGN,
    "Title": LEFT_ALIGN,
    "Difficulty": CENTER_ALIGN
}
console.log(createMarkDownTableStr(heads, datas));

function createMarkDownTableStr(heads, datas) {
    var res = "";
    var join = arr => "| " + arr.join(" | ") + " |\n";
    return `${join(Object.keys(heads))}${join(new Array(datas[0].length).fill("---"))}${datas.map(join).join("")}`;
}
var fs = require("fs");
fs.writeFile("test.md", createMarkDownTableStr(heads, datas));
/*

| Left-aligned | Center-aligned | Right-aligned |
| :---         |     :---:      |          ---: |
| git status   | git status     | git status    |
| git diff     | git diff       | git diff      |

*/




return;
(async() => {
    const browser = await puppeteer.launch({
        headless: true,
        devtools: false
    });
    const page = await browser.newPage();
    await page.goto('https://leetcode.com/problemset/algorithms/');
    await page.waitForSelector(".reactable-data");
    await page.select(".reactable-pagination select", "9007199254740991")
    await page.$$(".question-list-table .reactable-data tr")
    const questions = await page.evaluate((titles) => {
        const Q = (select) => Array.from(document.querySelectorAll(select));
        const titleIndexDic = Q(".reactable-column-header th").reduce(
            (res, el, index) => { return res[el.innerText] = index, res; }, {});
        return Q(".question-list-table .reactable-data tr").map(tr => {
            var tds = tr.getElementsByTagName("td");
            return titles.map(title => tds[titleIndexDic[title]].innerText.trim());
        });
    }, ["#", "Title", "Difficulty"]);
    console.log(questions);

    //await browser.close();
})();