const {Builder, By, Key, until} = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const { email, pass } = require('./creds');
const chromeOptions = new chrome.Options()
.addArguments('allow-file-access-from-files')
.addArguments('use-fake-device-for-media-stream')
.addArguments('use-fake-ui-for-media-stream')
.addArguments("disable-notifications");

const CURRENT_DAY = new Date().getDay();
const ROUTINE = {
    '0': { 
        '8:02': '-', 
        '8:52': 'GEO', 
        '10:02' : 'HIN', 
        '10:52' : 'BIO'
    },
    '1': {
        '8:02': 'PHY', 
        '8:52': 'HCE', 
        '10:02': '-', 
        '10:52': 'ENG'
    },
    '2': {
        '8:02': '-', 
        '8:52': 'HIN', 
        '10:02': 'IT', 
        '10:52': 'BIO'
    },
    '3': {
        '8:02': 'GEO', 
        '8:52': '-', 
        '10:02': 'ENG', 
        '10:52': 'BIO'
    },
    '4': {
        '8:02': '-', 
        '8:52': 'HIN', 
        '10:02': 'PT', 
        '10:52': 'PHY'
    },
    '5': {
        '8:02': 'BIO', 
        '8:52': '-', 
        '10:02': 'HCE', 
        '10:52': 'ENG'
    }
};
const LINKS = {
    'GEO': 'https://meet.google.com/lookup/gflb74w6lm',
    'HIN': 'https://meet.google.com/lookup/fushorjlyx',
    'PHY': 'https://meet.google.com/lookup/fqmdhzghkf',
    'BIO': 'https://meet.google.com/lookup/e3cdias5nj'
    'PT': 'https://meet.google.com/lookup/hg2xu3okug',
    'IT': 'https://meet.google.com/lookup/dooaoo4mxt',
    'ENG': 'https://meet.google.com/lookup/dtz24aco2y',
    'HCE': 'https://meet.google.com/lookup/au2gvmdmeo'
};
const LINKS = {
    'GEO': 'https://meet.google.com/xeo-mrnd-mrh',
    'HCE': 'https://meet.google.com/phj-rbgt-qfm'
}
const ROUTINE = {
    '5': {
        '15:43': 'GEO',
        '15:44': 'HCE'
    }
};
console.log(email, pass)
let openMeeting = async function(url) {
    let driver = await new Builder().forBrowser('chrome').setChromeOptions(chromeOptions).build();
    try{
        await driver.get('https://accounts.google.com/ServiceLogin/identifier?service=classroom&passive=1209600&continue=https%3A%2F%2Fclassroom.google.com%2F&followup=https%3A%2F%2Fclassroom.google.com%2F&emr=1&flowName=GlifWebSignIn&flowEntry=AddSession');

        const username = driver.findElement(By.id('identifierId'));
        (await username).click();

        username.sendKeys(email);
        
        let next = driver.findElement(By.xpath('//*[@id="identifierNext"]/div/button/div[2]'));
        (await next).click();
        
        setTimeout(async () => {
            const password = driver.findElement(By.name('password'));
            (await password).click();
            password.sendKeys(pass)

            next = driver.findElement(By.xpath('//*[@id="passwordNext"]/div/button/div[2]'));
            (await next).click();
        }, 2500);

        setTimeout(async () => {
            await driver.get(url)
        }, 8000)

        setTimeout(async () => {
            const camera = driver.findElement(By.xpath('/html/body/div[1]/c-wiz/div/div/div[8]/div[3]/div/div/div[2]/div/div[1]/div[1]/div[1]/div/div[3]/div[2]/div/div'));
            (await camera).click();
            
            const mic = driver.findElement(By.xpath('/html/body/div[1]/c-wiz/div/div/div[8]/div[3]/div/div/div[2]/div/div[1]/div[1]/div[1]/div/div[3]/div[1]/div/div/div'));
            (await mic).click();

            const join = driver.findElement(By.xpath('/html/body/div[1]/c-wiz/div/div/div[8]/div[3]/div/div/div[2]/div/div[1]/div[2]/div/div[2]/div/div[1]/div[1]'));
            (await join).click();
        }, 15000)
    }catch(err){
        console.log(err)
    }
}

function startJobAt(hh, mm, code) {
    var interval = 0;
    var today = new Date();
    var todayHH = today.getHours();
    var todayMM = today.getMinutes();
    if ((todayHH > hh) || (todayHH == hh && todayMM > mm)) {
        var midnight = new Date();
        midnight.setHours(24,0,0,0);
        interval = midnight.getTime() - today.getTime() +
                (hh * 60 * 60 * 1000) + (mm * 60 * 1000);
    } else {
        interval = (hh - todayHH) * 60 * 60 * 1000 + (mm - todayMM) * 60 * 1000;
    }
    console.log(interval)
    return setTimeout(code, interval);
}

Object.keys(ROUTINE[CURRENT_DAY]).forEach(i => {
    let value = ROUTINE[CURRENT_DAY][i];
    if(value == '-') return;
    let [hh, mm] = i.split(':');
    startJobAt(+hh, +mm, () => {
        openMeeting(LINKS[value])
    })
})
