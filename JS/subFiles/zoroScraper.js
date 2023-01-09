const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const cheerio = require("cheerio");

const parseWatching = async (html) => {
    let $ = cheerio.load(html);

    let newestShow = $("div[class=flw-item]")[0];
    if (!newestShow) return null;

    let showDetails = $(newestShow).find(".film-detail");
    let languageSupport = "", bannerChildren = $(newestShow).find("div[class=film-poster]").find(`div[class="tick ltr"]`).children();
    
    bannerChildren.each((index, current) => {
        languageSupport += `${(index>0 && index!=bannerChildren.length)?" / ":""}${$(current).text()}`
    });

    return {
        showName: $(showDetails).find(".film-name").find(".dynamic-name").text().trim(),
        currentEp: $(showDetails).find(".fd-bar").find(".fdb-type").text(),
        refLink: $(showDetails).find(".film-name").find(".dynamic-name").attr("href"),
        languageSupport,
        timeStamp: $(showDetails).find(".fd-bar").find(".fdb-time").find("span").text()
    }
};

const getLatestWatching = async (token) => {
    let recentWatches = await fetch("https://zoro.to/user/continue-watching", {
        headers: {
            "sec-ch-ua": `"Not?A_Brand";v="8", "Chromium";v="108", "Brave";v="108"`,
            cookie: `connect.sid=${token}`
        }
    }).catch((err) => console.log(err));

    if (!recentWatches || recentWatches.status != 200) return await reactiveDelay(10_000, getLatestWatching(token));

    if (recentWatches.redirected) {
        console.log("Incorrect token");
        await reactiveDelay(10_000, process.exit)
    };

    let siteHTML = await recentWatches.text();

    return await parseWatching(siteHTML)
};

module.exports = {getLatestWatching}