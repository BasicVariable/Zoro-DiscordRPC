const fs = require("node:fs");
const yaml = require("js-yaml");
const rpc = require("discord-rpc")

// --- 
const zoroScraper = require("./subFiles/zoroScraper.js")
// ---

const client = new rpc.Client({ transport: 'ipc' });

var config;

const updatePresence = (newData, idle, time) => {
    let activeObj = {
        pid: process.pid, 
        activity : {
            details : `${(idle)?"Idle on":"Watching"} ${newData.showName}`,
            state: `Episode ${newData.currentEp} • ${newData.languageSupport}`,
            assets : {
                large_image : "zoroicon", 
                large_text : "zoro.to" 
            },
            timestamps: time,
            buttons : [
                {label : "Episode" , url : `https://zoro.to/${newData.refLink}`}
                // {label : "Join",url : "watch together link"}
            ]
        }
	};

    if (!time || idle) delete activeObj.activity.timestamps;

    client.request('SET_ACTIVITY', activeObj)
};

const timeStamp2Time = (timeStamp) => {
    let splitTime = timeStamp.split(":");

    return (Date.now() - parseInt(splitTime[0])*60_000) - parseInt(splitTime[1]*1_000)
};

global.reactiveDelay = (ms, reaction) => new Promise(res => {
    setTimeout(async () => {
        if (reaction) res(await reaction());
        res()
    }, ms)
});

fs.readFile("./config.yml", 'utf-8', async (err, res) => {
    if (err) {
        console.log("Failed to read config.yml", err);
        await reactiveDelay(20_000, process.exit)
    };
    
    try{
        config = yaml.load(res)
    }catch(err){
        console.log("Failed to parse yaml", err);
        await reactiveDelay(20_000, process.exit)
    };

    let lastTimeStamp = "", lastIdleStart;
    client.on('ready', async () => {
        while (true){
            let newData = await zoroScraper.getLatestWatching(config.auth.zoroToken);
            if (!newData) continue;

            let idle = newData.timeStamp === lastTimeStamp;

            if (lastIdleStart || Date.now() - Date.now() >= config.maxIdleTime){
                if (lastTimeStamp) client.clearActivity(process.pid);

                lastTimeStamp = null;
                await reactiveDelay(15_000);

                continue
            };
            if (idle) lastIdleStart = Date.now();
            
            lastTimeStamp = newData.timeStamp;

            updatePresence(
                newData, 
                idle, 
                (idle)?null:{
                    start: await timeStamp2Time(newData.timeStamp)
                }
            );

            await reactiveDelay(20_000);
        }
    });

    client.login({ clientId: "1062072554992435240" }).catch(console.error)
})
