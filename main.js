const electron = require("electron")
const url = require("url")
const path = require("path")


// pulling the app and BrowserWindow Object from the electron module
const { app, BrowserWindow, Menu, ipcMain } = electron;

// SET ENVIRONMENT
process.env.NODE_ENV = 'production'

// a variable to represent our main window
let mainWindow;
let addWindow;

// Listen for the app to be ready
app.on('ready', function(){
    // create new window
    mainWindow = new BrowserWindow({});
    
    // load the html file into the window
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, "mainWindow.html"),
        protocol: 'file:',
        slashes: true
    }))

    // Quit app when closed
    mainWindow.on('close', function(){
        app.quit()
    })

    // Build menu from template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate)
    Menu.setApplicationMenu(mainMenu)
})

// Handle create add window 
function createAddWindow() {

    addWindow = new BrowserWindow({
        width: 300,
        height: 200,
        title: 'Add shopping list item'
    });

     // load the html file into the window
     addWindow.loadURL(url.format({
        pathname: path.join(__dirname, "addWindow.html"),
        protocol: 'file:',
        slashes: true
    }))

    // garbage collection
    addWindow.on('close', function(){
        addWindow = null
    })
}

// Catch item:add
ipcMain.on('item:add', function(e, item){
    mainWindow.webContents.send('item:add', item)
    addWindow.close()
})

// Create menu template
var mainMenuTemplate = [

    {
        label: 'File', 
        submenu: [
            {
                label: "Add Item",
                click(){
                    createAddWindow()
                }
            },
            {
                label: "Clear Items",
                click(){
                    mainWindow.webContents.send('item:clear')
                }
            },
            {
                label: "Quit",
                accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
                click(){
                    app.quit()
                }
            }
        ]
    }
]

// If Mac, add empty object to menuTemplate, so we get to see the "File" menu item
// if (process.platform == 'darwin'){
//     mainMenuTemplate.unshift({label:""});
// }

// Add developer tools if not in production
if (process.env.NODE_ENV !== 'production'){
    mainMenuTemplate.push({
        label: 'Developer Tools',
        submenu: [
            {
                label: 'Toggle DevTools',
                accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
                click(item, focusedWindow){
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role : 'reload'
            }
        ]
    })
}