const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const captchaSolving = require('./captcha');

function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--start-maximized'] 
  });
  
  const [page] = await browser.pages();

  const { width, height } = await page.evaluate(() => {
    return {
      width: window.screen.width,
      height: window.screen.height
    };
  });

  await page.setViewport({ width, height });

  const filePath = path.join(__dirname, 'data.json');
  const fileData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  console.log('Loaded credentials:', fileData);

  await page.goto('https://parents.kletech.ac.in/index.php', { waitUntil: 'networkidle2' });

  await page.waitForSelector('#username');
  await page.type('#username', fileData.username, { delay: 250 });
  
  await page.click('#dd');

  const dayIndex = parseInt(fileData.dd); 
  for (let i = 0; i < dayIndex; i++) {
    await page.keyboard.press('ArrowDown');
    await delay(75); 
  }
  await page.keyboard.press('Enter');

  await page.click('#mm'); 
  const monthIndex = parseInt(fileData.mm); 
  for (let i = 0; i < monthIndex; i++) {
    await page.keyboard.press('ArrowDown');
    await delay(75); 
  }
  await page.keyboard.press('Enter');

  await page.click('#yyyy'); 
  const yearIndex = fileData.yyyy - 1963; 
  for (let i = 0; i < yearIndex; i++) {
    await page.keyboard.press('ArrowDown');
    if(i < 37){
      await delay(1); 
    }else{
      await delay(75); 
    }
  }
  await page.keyboard.press('Enter'); 

  console.log('Filled form fields with credentials');

  const imageSrc = await page.evaluate(() => {
    const image = document.querySelector('.uk-margin img');
    return image ? image.src : null;
  });

  if (imageSrc) {
    console.log('Captcha image found:', imageSrc);

    const captchaImagePath = path.join(__dirname, 'captcha.png');
    const writer = fs.createWriteStream(captchaImagePath);
    const response = await axios({
      url: imageSrc,
      method: 'GET',
      responseType: 'stream'
    });

    response.data.pipe(writer);

    await new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });

    const solvedCaptcha = await captchaSolving(captchaImagePath);
    console.log('Solved captcha:', solvedCaptcha);

    await page.waitForSelector('#security_code');
    await page.type('#security_code', solvedCaptcha, { delay: 250 });

    await delay(100); 

    await page.click('.uk-button.uk-button-primary.uk-button-large.uk-width-1-1.cn-login-btn.cn-submit1');

    await page.waitForNavigation({ waitUntil: 'networkidle2' });
    
    const errorMessage = await page.evaluate(() => {
      const errorElement = document.querySelector('.error-message');
      return errorElement ? errorElement.innerText : null;
    });

    if (errorMessage) {
      console.error('Login failed with message:', errorMessage);
    } else {
      console.log('Login successful!');
    }
  } else {
    console.error('Captcha image not found.');
  }

  await delay(600000);

  await browser.close();
})();

function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}
