const fs = require('fs');
const fetch = (...args) => import('node-fetch').then(module => module.default(...args));

const filePath = __dirname + '/details.json';
const fileData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

let userCredentials = {
  grant_type: fileData.grant_type,
  client_id: fileData.client_id,
  client_secret: fileData.client_secret,
  username: fileData.username,
  password: fileData.password,
};

const captchaSolving = async (imgpathGivenByWebsite) => {
  const getToken = async (user, url) => {
    let options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(user),
    };

    let response = await fetch(url, options);
    try {
      const result = await response.json();
      return result.access_token;
    } catch (error) {
      console.log("Error fetching token:", error);
      return null;
    }
  };

  const getBase64Encoded = (filePath) => {
    try {
      const file = fs.readFileSync(filePath);
      return file.toString('base64');
    } catch (error) {
      console.error("Error encoding image:", error);
      return null;
    }
  };

  const captchaSolver = async (url, token, data) => {
    let options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    };

    let response = await fetch(url, options);
    try {
      const result = await response.json();
      if (result.status_code === 200) {
        return result.data.result;
      } else if (result.status_code === 401) {
        console.log("Authentication error. Token might have expired.");
      } else {
        console.log("Captcha solving failed. Status code:", result.status_code);
      }
    } catch (error) {
      console.log("Error solving captcha:", error);
    }
  };

  let oauthUrl = "https://app.metabypass.tech/CaptchaSolver/oauth/token";
  let token = await getToken(userCredentials, oauthUrl);

  if (!token) {
    console.log("Failed to retrieve access token");
    return "Couldn't solve captcha, please enter manually";
  }

  let base64Image = getBase64Encoded(imgpathGivenByWebsite);
  if (!base64Image) {
    console.log("Failed to encode image");
    return "Couldn't solve captcha, please enter manually";
  }

  let captchaApiUrl = "https://app.metabypass.tech/CaptchaSolver/api/v1/services/captchaSolver";
  let data = { image: base64Image };

  let solvedCaptcha = await captchaSolver(captchaApiUrl, token, data);
  if (solvedCaptcha) {
    console.log("Solved captcha successfully");
    return solvedCaptcha;
  } else {
    console.log("Captcha solving failed");
    return "Couldn't solve captcha, please enter manually";
  }
};

module.exports = captchaSolving;
