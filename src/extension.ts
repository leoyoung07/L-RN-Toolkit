'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import clipboardy from 'clipboardy';
import * as vscode from 'vscode';
import { DeviceItem } from './Explorer/Devices/DeviceItem';
import { DevicesNodeProvider } from './Explorer/Devices/DevicesNodeProvider';
import { shellCommand } from './Utils';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  // tslint:disable-next-line:no-console
  console.log('Congratulations, your extension "l-rn-toolkit" is now active!');

  const devicesNodeProvider = new DevicesNodeProvider(context);
  vscode.window.registerTreeDataProvider(
    'l-rn-toolkit-view-devices',
    devicesNodeProvider
  );

  const outputChannel = vscode.window.createOutputChannel('L-RN-Toolkit');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with  registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    'l-rn-toolkit.refreshDevicesView',
    () => {
      // The code you place here will be executed every time your command is executed
      devicesNodeProvider.refresh();
    }
  );

  context.subscriptions.push(disposable);

  disposable = vscode.commands.registerCommand(
    'l-rn-toolkit.copyDeviceId',
    async (deviceItem: DeviceItem) => {
      // The code you place here will be executed every time your command is executed
      if (deviceItem && deviceItem.deviceId) {
        await clipboardy.write(deviceItem.deviceId);
      }
    }
  );

  context.subscriptions.push(disposable);

  disposable = vscode.commands.registerCommand(
    'l-rn-toolkit.deployToDevice',
    async (deviceItem: DeviceItem) => {
      // The code you place here will be executed every time your command is executed
      if (deviceItem && deviceItem.deviceId) {
        try {
          outputChannel.show();
          await shellCommand(
            'react-native',
            ['run-android', '--deviceId', deviceItem.deviceId],
            { cwd: vscode.workspace.rootPath },
            (data) => {
              outputChannel.append(data);
            }
          );
        } catch (error) {
          outputChannel.appendLine(error);
          outputChannel.show();
        }
      }
    }
  );

  context.subscriptions.push(disposable);

  disposable = vscode.commands.registerCommand(
    'l-rn-toolkit.reloadApp',
    async (deviceItem: DeviceItem) => {
      // The code you place here will be executed every time your command is executed
      if (deviceItem && deviceItem.deviceId) {
        await shellCommand('adb', [
          '-s',
          deviceItem.deviceId,
          'shell',
          'input',
          'text',
          '"RR"'
        ]);
      }
    }
  );

  context.subscriptions.push(disposable);

  disposable = vscode.commands.registerCommand(
    'l-rn-toolkit.openDevMenu',
    async (deviceItem: DeviceItem) => {
      // The code you place here will be executed every time your command is executed
      if (deviceItem && deviceItem.deviceId) {
        await shellCommand('adb', [
          '-s',
          deviceItem.deviceId,
          'shell',
          'input',
          'keyevent',
          '82'
        ]);
      }
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {
  // this method is called when your extension is deactivated
}
