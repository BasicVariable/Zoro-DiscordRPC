# Zoro-DiscordRPC
Discord rich presence updater for the anime site zoro.to, uses connect.sid cookie to refresh your presence. 

BEFORE INSTALLING MAKE SURE TO INSTALL THE CURRENT LTS VERSION OF NODE.JS
```
1. Download all the files in this repository through the code button and by clicking "download zip"
2. Extract the zip and open the folder the files are in
  2a. Setup config.yml (check instuction below)
3. Open command prompt with the folder that contains all the files as the directory
4. Type 'cd ./JS' and press enter
5. Type 'npm install' and press enter
6. Type 'cd ../' and press enter
7. Type 'node ./JS/index.js'
(whenever you want to run it again only do steps 3 and 7)
```

# zoroToken
```
To get this token:
1. Get the "EditThisCookie" chrome extension (or equivalent) 
2. Go to 'https://zoro.to/home' and login
3. Click the "EditThisCookie" extension and click the connect.sid tab
4. Copy the contents of the connect.sid tab
5. Paste everything in "zoroToken" in config.yml (in-between the quotes)
```
