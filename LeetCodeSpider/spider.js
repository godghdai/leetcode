const puppeteer = require('puppeteer');
var fs = require("fs");
var path = require("path");
const querystring = require('querystring');

var spiderPath = __dirname;
var spiderParentPath = path.resolve('../');
var markDownSavePath = path.join(spiderParentPath, "README.md");

var ignoreDirSet = new Set([".git", "LeetCodeSpider", "Resource", "README.md", ".gitignore"]);
var filePathDic = {};
readDirSync(spiderParentPath);

function readDirSync(dirpath) {
    fs.readdirSync(dirpath).forEach(filename => {
        if (ignoreDirSet.has(filename)) return;
        var filepath = path.join(dirpath, filename);
        if (fs.statSync(filepath).isDirectory())
            readDirSync(filepath);
        else if (/^(\d+)\.(.+)\.md/.test(filename)) {
            filePathDic[RegExp.$1] = querystring.escape(path.relative(spiderParentPath, filepath).split(path.sep).join('/'));
        }
    })
}


const LEFT_ALIGN = ":---",
    CENTER_ALIGN = ":---:",
    RIGHT_ALIGN = "---:";
var heads = {
    " ": CENTER_ALIGN,
    "Num": CENTER_ALIGN,
    "Title": LEFT_ALIGN,
    "Solution": LEFT_ALIGN,
    "Acceptance": CENTER_ALIGN,
    "Difficulty": CENTER_ALIGN
}

function createMarkDownTableStr(heads, datas) {
    var rowjoin = arr => "| " + arr.join(" | ") + " |\r\n";
    return `${rowjoin(Object.keys(heads))}${rowjoin(Object.keys(heads).map(head=>heads[head]))}${datas.map(data=>{
        var res=[];
        res.push(filePathDic[data.number]?":heavy_check_mark:":"");
        res.push(data.number);
        res.push(`[${data.title.text}](${data.title.url})`);
        res.push(filePathDic[data.number]?`[JavaScript](${filePathDic[data.number]})`:'');
        res.push(data.acceptance);        
        res.push(data.difficulty);
        return rowjoin(res);
    }).join("")}`;
}

function createTableTitle(datas){
    var countDic={"Easy":0,"Medium":0,"Hard":0};
    var solved=0;
    datas.forEach(data=>{
        if(filePathDic[data.number]){
            countDic[data.difficulty]+=1;
            solved++;
        } 
    });
    return `\`${solved}/${datas.length} Solved\` - \`Easy ${countDic["Easy"]}\` \`Medium ${countDic["Medium"]}\` \`Hard ${countDic["Hard"]}\``;
}

function createMarkDown(heads, datas){
    var title=createTableTitle(datas);
    var tableStr=createMarkDownTableStr(heads,datas);
    return title+"\r\n\r\n"+tableStr;
}


/*

| Left-aligned | Center-aligned | Right-aligned |
| :---         |     :---:      |          ---: |
| git status   | git status     | git status    |
| git diff     | git diff       | git diff      |

*/


;
(async () => {
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
                'status': tr.querySelector("td:nth-child(1)").getAttribute("value") || "dd",
                "number": +innerText("#"),
                "title": {
                    "text": tr.querySelector("td:nth-child(" + indexDic["Title"] + ") a").innerText.trim(),
                    "url": tr.querySelector("td:nth-child(" + indexDic["Title"] + ") a").href
                },
                "difficulty": innerText("Difficulty"),
                "acceptance": innerText("Acceptance")
            }
        });
    });

    
    console.log(questions[0]);

    fs.writeFileSync(markDownSavePath, createMarkDown(heads, questions));

    await browser.close();
})();