import * as vscode from 'vscode';
import * as querystring from 'querystring';
import { v4 as uuidv4 } from 'uuid';
import { basename } from 'path';
import { Base64 } from 'js-base64';

export function activate(context: vscode.ExtensionContext) {

	let sessionUUID = uuidv4();

	let disposable = vscode.commands.registerCommand('alma4code.retrieve', () => {
		const activeEditor = vscode.window.activeTextEditor;

		if(!activeEditor) {
			vscode.window.showErrorMessage("No active text editor open!");
			return;
		}

		let selection = activeEditor.selection;
		let document = activeEditor.document;
		let fileName = document.fileName;
		let path = document.uri.fsPath;
		// let wholeCode = document.getText();
		let selectedCode = document.getText(selection);

		const { exec } = require('child_process');

		exec(`swift semantic "${path}" ${selection.start.line+1} ${selection.start.character+1} ${selection.end.line+1} ${selection.end.character+1}`, (error:Error, stdout:string, stderr:string) => {
			if(error) {
				vscode.window.showErrorMessage(`${error.message}`);
				return;
			}

			if(stderr) {
				vscode.window.showErrorMessage(`${stderr}`);
				return;
			}

			let data = JSON.parse(stdout);

			if(data.error) {
				vscode.window.showErrorMessage(`${data.error}`);
				return;
			}

			let nodeType = data.nodeType;
			// let selectedNode = data.selectedNode;
			let concepts = data.concepts;

			if(concepts.length === 0) {
				vscode.window.showErrorMessage(`No concepts found for node type "${nodeType}"`);
				return;
			}

			let params = {
				app: "VSCode",
				session: sessionUUID,
				uris: JSON.stringify(concepts),
				selection: Base64.encode(selectedCode),
				context: encodeURIComponent(vscode.workspace.name ?? path),
				file: encodeURIComponent(basename(fileName))
			};
			let url = `https://alma.uni.lu/api/learningmaterial/?${querystring.stringify(params)}`;
			vscode.env.openExternal(vscode.Uri.parse(url));

		});
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}
