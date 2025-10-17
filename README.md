
## Documentation for Windows Systems

Firstly, you'll need to download the files by clicking the green code button, then clicking 'Download ZIP'. Extract all the files onto a new folder named 'VisionVoice' anywhere on your computer, although on your desktop is preferred. 

While it's extracting, you'll need to download the latest version of Node.js if you don't have it already: https://nodejs.org/en/download. If you're unsure, open Command Prompt/PowerShell and run `node -v`. It should output the version that you're running. If not, install it. 

Then, run Windows Powershell as administrator and cd into the directory that the folder is in. For me, it'll be this:
`cd C:\Users\Pat\Desktop\VisionVoice`. 

After you're in the directory, run `npm install express axios cors`. This installs the packages that the project needs for the backend. 

If you get any errors, it's probably because of the security settings on your machine. You can run `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned` in PowerShell to disable this, then run the axios cors command again in PowerShell.

After that, you can close out of all PowerShell/cmd prompt windows and open up 2 fresh instances of PowerShell in Administrator again. 


In one administrator priviledge PowerShell, CD into the same directory as before and run `node server.js`, which will start the javascript backend. Leave it in the background for now.

In another PowerShell running in Administrator, CD into the directory as before, then run `npx serve .`. It'll ask you to install the following packages, click 'y' then enter. After this, it will serve that directory as a server and give you a Local IP address. The 3000 port is already in use because of the javascript backend, so it'll give you a random one. Copy this IP into a browser, preferably Google Chrome and it should work.

To safely close out of the website, click `CTRL+C` on both PowerShell instances and it'll shut down :)

## Running it after installation
To run it again after installation, run PowerShell as Administrator, CD into the path where VisionVoice is located, then host the node.js server using `node server.js`. 
Then open another PowerShell, CD into the directory, then run `serve .`. This will give you the IP needed to access the website. Ensure you run the node.js server first, then serve the directory. 

## Documentation for MacOS/Linux Systems
No documentation for MacOS/Linx systems will be provided, although the steps above are pretty similar to what you need to do. 



## Using VisionVoice

Open Webcam Button → Grant Permission → User captures image

Upload Image Clicked → Select a file locally on your computer. 

The Gemini 2.5-flash multimodal model will analyse the image and display + speak the description.

Use the High Contrast button for accessibility.
