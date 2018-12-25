const puppeteer = require('puppeteer');

var datas = [{
        n: 97,
        title: {
            text: 'Interleaving String',
            url: 'https://leetcode.com/problems/interleaving-string'
        },
        difficulty: 'Hard'
    },
    {
        n: 98,
        title: {
            text: 'Validate Binary Search Tree',
            url: 'https://leetcode.com/problems/validate-binary-search-tree'
        },
        difficulty: 'Medium'
    }
]

const LEFT_ALIGN = ":---",
    CENTER_ALIGN = 1,
    RIGHT_ALIGN = 2;
var heads = {
    "#": CENTER_ALIGN,
    "Title": LEFT_ALIGN,
    "Difficulty": CENTER_ALIGN
}

function createMarkDownTableStr(heads, datas) {
    var join = arr => "| " + arr.join(" | ") + " |\n";
    return `${join(Object.keys(heads))}${join(new Array(Object.keys(heads).length).fill("---"))}${datas.map(data=>{
        data["title"]=`[${data.title.text}](${data.title.url})`;
        return join(Object.values(data));
    }).join("")}`;
}
var fs = require("fs");



/*

| Left-aligned | Center-aligned | Right-aligned |
| :---         |     :---:      |          ---: |
| git status   | git status     | git status    |
| git diff     | git diff       | git diff      |

*/

;
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
    const questions = await page.evaluate(() => {
        const Q = (select) => Array.from(document.querySelectorAll(select));
        const indexDic = Q(".reactable-column-header th").reduce((res, el, index) => {
            return res[el.innerText] = index + 1, res;
        }, {});
        return Q(".question-list-table .reactable-data tr").map(tr => {
            var innerText = title => tr.querySelector("td:nth-child(" + indexDic[title] + ")").innerText.trim();
            return {
                "n": +innerText("#"),
                "title": {
                    "text": innerText("Title"),
                    "url": tr.querySelector("td:nth-child(" + indexDic["Title"] + ") a").href
                },
                "difficulty": innerText("Difficulty"),
            }
        });
    });
    fs.writeFile("test.md", createMarkDownTableStr(heads, questions));
    //console.log(questions);

    //await browser.close();
})();