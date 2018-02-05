# Node.JS PDF Generation Service.
## Installation Instructions
### Windows
#### Setup for Manual Run
1. Install [Node.JS](https://nodejs.org/en/download/)
2. Open the command prompt in the directory GenPDFService.js exist.
3. Install Puppeteer by type
```
npm install puppeteer
```
4. To run the service type
```
node GenPDFService.js
```
#### Install Service as a Windows Service

To set up this service on a windows machine to autostart when windows loads.

1. Copy all the contents of this folder to c:\PDFService\
2. Open command prompt to c:\PDFService
3. Type the following commands
```
npm install node-windows
node WindowsInstallService.JS
```

### Linux (Ubuntu 16.04)
#### Setup for Manual Run
1. Open your terminal window to install nodeJS
2. Type the following commands
```
sudo apt-get install curl
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install nodejs
sudo apt-get install build-essential
sudo apt-get install GConf2
npm install puppeteer
```
3. To run type the following command into the terminal
```
node GenPDFService.js
```
#### Install Service into linux services
1. type the following commands
```
sudo npm install -g pm2
pm2 start GenPDFService.js
pm2 startup systemd
```
2. pm2 will generate a script for you copy and paste it into the terminal
3. Type the following
```
pm2 save
```
4. If for some reason this service does not start on reboot type
```
pm2 resurrect
```

## Uninstall Instructions
### Windows
#### Uninstall Service from Windows Services

1. Open a command prompt to c:\PDFService
2. Type the following command
```
node WindowsUnintallService.JS
```

### Linux (ubuntu 16.04)
#### Uninstall Service from Linux services
1. Open the terminal and type
```
pm2 delete GenPDFService
```

## How to use
### Configuation
You can set the default configuration of the service by changing the constants at the top of the GenPDFService.js file.

#### Config Variables

| Varible | Description              |
| ------- | ------------------------ |
| port    | Port number to listen to |
| psuedoHost | Host to display in footer |
| defaultShowHeaderFooter | determines if header and footer should be displayed|
| Default Format | determines what the default format should be. accepted formats are Letter, Legal, Tabloid, Ledger, A0, A1, A2, A3, A4, A6 |

### Using the service

When you make a call to the service you need to make a HTTP POST on port the port defined default 8080. The body of the 
Post needs to contain the HTML that you wish to convert to a PDF, and PDF Specific configurations will be entered into the Querystring. 

For example: http://<PDFService.URL>:8080?showHeaderFooter=true&host=http://google.com&format=A4

The querystring parameters will override the config variables

#### Query String parameters

| Varible | Description              |
| ------- | ------------------------ |
| host | Host to display in footer |
| showHeaderFooter | determines if header and footer should be displayed|
| format | determines what the default format should be. accepted formats are Letter, Legal, Tabloid, Ledger, A0, A1, A2, A3, A4, A6 |


