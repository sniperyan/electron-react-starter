
// Electron requires
const { app, dialog, shell, Menu } = require('electron');

const separatorItem = {
  type: 'separator'
};

function TemplateBuilder(platform, mainWindow) {
  const appName = app.getName();
  const isDarwin = platform === 'darwin';
  const firstMenuName = isDarwin ? appName : 'File';

  this.appMenu = null;
  if (isDarwin) {
    this.appMenu = {
      label: '&' + firstMenuName,
      submenu: [
        {
          label: 'About ' + appName,
          role: 'about',
          click() {
            dialog.showMessageBox(mainWindow, {
              buttons: ['OK'],
              message: `${appName} Desktop ${app.getVersion()}`
            });
          }
        }, {
          label: 'Check for Update',
          click() {
            dialog.showMessageBox(mainWindow, {
              buttons: ['OK'],
              message: '模块构建中，敬请期待！'
            });
            // try {
            //   UpdateManager.checkForUpdates((hasUpdate) => {
            //     if (hasUpdate) {
            //       return dialog.showMessageBox(QUESTION.shouldRestartAndUpdate) == 0
            //     }
            //     dialog.showMessageBox(INFO.noUpdateIsAvailable)
            //     return false
            //   })
            // } catch (e) {
            //   Logger.error(e)
            // }
          }
        }, separatorItem, {
          label: 'Services',
          role: 'services',
          submenu: []
        }, separatorItem, {
          label: 'Hide',
          accelerator: 'Command+H',
          role: 'hide'
        }, {
          label: 'Hide Others',
          accelerator: 'Command+Shift+H',
          role: 'hideothers'
        }, {
          label: 'Show All',
          role: 'unhide'
        }, separatorItem, {
          label: 'Quit',
          accelerator: 'Command+Q',
          click() {
            app.quit();
          }
        }
      ]
    };
  }

  this.editMenu = {
    label: '&Edit',
    submenu: [
      {
        label: 'Undo',
        accelerator: 'CmdOrCtrl+Z',
        role: 'undo'
      }, {
        label: 'Redo',
        accelerator: 'Shift+CmdOrCtrl+Z',
        role: 'redo'
      }, separatorItem, {
        label: 'Cut',
        accelerator: 'CmdOrCtrl+X',
        role: 'cut'
      }, {
        label: 'Copy',
        accelerator: 'CmdOrCtrl+C',
        role: 'copy'
      }, {
        label: 'Paste',
        accelerator: 'CmdOrCtrl+V',
        role: 'paste'
      }, {
        label: 'Select All',
        accelerator: 'CmdOrCtrl+A',
        role: 'selectall'
      }
    ]
  };

  this.viewMenu = {
    label: '&View',
    submenu: [
      {
        label: 'Toggle Full Screen',
        role: 'togglefullscreen'
      }, separatorItem, {
        role: 'resetzoom'
      }, {
        role: 'zoomin'
      }, {
        label: 'Zoom In (hidden)',
        accelerator: 'CmdOrCtrl+=',
        visible: false,
        role: 'zoomin'
      }, {
        role: 'zoomout'
      }, {
        label: 'Zoom Out (hidden)',
        accelerator: 'CmdOrCtrl+Shift+-',
        visible: false,
        role: 'zoomout'
      }, separatorItem, {
        label: 'Toggle Developer Tools',
        accelerator: isDarwin ? 'Alt+Command+I' : 'Ctrl+Shift+I',
        click(item, focusedWindow) {
          if (focusedWindow) {
            focusedWindow.toggleDevTools();
          }
        }
      }, {
        label: 'Reload',
        accelerator: 'CmdOrCtrl+R',
        click(item, focusedWindow) {
          if (focusedWindow) {
            focusedWindow.reload();
          }
        }
      }, separatorItem, {
        label: 'Back',
        accelerator: isDarwin ? 'Cmd+[' : 'Alt+Left',
        click: (item, focusedWindow) => {
          focusedWindow.webContents.canGoBack() && focusedWindow.webContents.goBack();
        }
      }, {
        label: 'Forward',
        accelerator: isDarwin ? 'Cmd+]' : 'Alt+Right',
        click: (item, focusedWindow) => {
          focusedWindow.webContents.canGoForward() && focusedWindow.webContents.goForward();
        }
      }
    ]
  };

  this.windowMenu = {
    label: '&Window',
    role: 'window',
    submenu: [
      {
        label: 'Minimize',
        accelerator: 'CmdOrCtrl+M',
        role: 'minimize'
      }, separatorItem, {
        label: 'Bring All to Front',
        role: 'front'
      }
    ]
  };

  this.helpMenu = {
    label: '&Help',
    submenu: [
      {
        label: 'Learn More...',
        click() {
          shell.openExternal('http://192.168.61.91:19001/maxwell/mx-workstation/wikis/home');
        }
      }, separatorItem, {
        label: `Version ${app.getVersion()}`,
        enabled: false
      }
    ]
  };
}

TemplateBuilder.prototype.makeTemplate = function () {
  const template = [];
  this.appMenu && template.push(this.appMenu);

  template.push(this.editMenu);
  template.push(this.viewMenu);
  template.push(this.windowMenu);
  template.push(this.helpMenu);

  return template;
};

function createMenu(mainWindow) {
  const template = new TemplateBuilder(process.platform, mainWindow).makeTemplate();
  return Menu.buildFromTemplate(template);
}

module.exports = {
  createMenu
};
