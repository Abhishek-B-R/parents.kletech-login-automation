## This repo contains all the code required to automate the login process of parents.kletech website

## Firstly fork this repo and give a star to this repo , as this motivates me to do such stuff more

### To run this natively on your machine and automate yourself:

1. **Pre-requisites**:
    - Make sure you have `node` (version 14+) and `git` (version 2.x or higher) installed on your system. If not, you can install them by following tutorials available on YouTube for your operating system.

2. **Clone the repository**:
    - Open your terminal/command prompt and run the following commands to clone the repository and navigate to the project folder:
    ```bash
    git clone https://github.com/Abhishek-B-R/parents.kletech-login-automation.git
    cd parents.kletech-login-automation
    ```

3. **Install dependencies**:
    - Run the following command to install all the required dependencies listed in `package.json`:
    ```bash
    npm install
    ```

4. **Set up the configuration files**:
    - Run the following commands to create the necessary configuration files:
    ```bash
    mv data.example.json data.json
    mv details.example.json details.json
    ```

5. **Configure MetaBypass API**:
    - Head over to `https://metabypass.tech/` and create a free account. After logging in, navigate to the `application` section and click on the `Copy Json` button.
    - Paste the copied content into `details.json`. Ensure that the API credentials are correctly set up in this file.You can refer the example format given in this repo.

6. **Enter Your Details**:
    - Open `data.json` and enter your USN and Date of Birth (DOB) in the appropriate fields.

7. **Run the automation**:
    - Run the following command to start the automation process:
    ```bash
    npm run start
    ```
    - This will initiate the script, which will log into the parents.kletech website using the credentials you've provided.

**Your automation setup should now be complete!** If everything is configured correctly, the login process will be automated.
