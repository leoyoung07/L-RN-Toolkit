import * as vscode from 'vscode';
import { DeviceItem } from './DeviceItem';

export class DevicesNodeProvider
  implements vscode.TreeDataProvider<DeviceItem> {
  public readonly onDidChangeTreeData?:
    | vscode.Event<DeviceItem | null | undefined>
    | undefined;

  private treeDataChangeEventEmitter: vscode.EventEmitter<
    DeviceItem | null | undefined
  >;
  constructor(private context: vscode.ExtensionContext) {
    this.treeDataChangeEventEmitter = new vscode.EventEmitter<
      DeviceItem | null | undefined
    >();
    this.onDidChangeTreeData = this.treeDataChangeEventEmitter.event;
  }
  public getTreeItem(
    element: DeviceItem
  ): vscode.TreeItem | Thenable<vscode.TreeItem> {
    return element;
  }
  public getChildren(
    element?: DeviceItem | undefined
  ): vscode.ProviderResult<DeviceItem[]> {
    if (!element) {
      return Promise.resolve([
        new DeviceItem(
          this.context,
          'test_device',
          'Test Device',
          vscode.TreeItemCollapsibleState.None
        )
      ]);
    } else {
      return Promise.resolve([]);
    }
  }
}
