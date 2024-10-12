## This repo contains all the code required to automate the login process of parents.kletech website

### To run this natively on your machine and automate yourself, 

1. **Make sure you have `node` and `git` installed locally if not do that first, you can refer any youtube video according to your OS**

2. **Now to copy all codes from this repo, run**
```bash
    git clone 
    cd 
```
3. Now run 
```bash
    npm install
    mv data.example.json data.json
    mv details.example.json details.json
```
3. **Now head over to `https://metabypass.tech/` and create a free account. After login,head over to `application` and click on `Copy Json` button now paste it in details.json**

4. **Now enter your usn,DOB in data.json**

5. **Now run** 
```bash
    npm run start
```
**Your model should work now**