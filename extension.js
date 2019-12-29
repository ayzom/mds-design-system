// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const mds = require('./mds.json');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

console.log('decorator sample is activated');

let timeout = undefined;

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "morningstar design system" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('extension.mdsHack1', () => {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('MDS Activated!');
	});

	let disposable2 = vscode.commands.registerCommand('extension.mdsConstants1', () => {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('MDS Activated Constants!');

		// var newData = Object.keys(mds).reduce(function(obj,key){
		// 	obj[ mds[key] ] = key;
		// 	return obj;
		//  },{});

		vscode.languages.registerHoverProvider('javascript', {  // or 'star rod script'
		provideHover(document, position, token) {

				const range = document.getWordRangeAtPosition(position, /(^[$](?:\w+-)+\w+)/);
				const word = document.getText(range);

				//vscode.window.showInformationMessage(Object.keys(newData));
				if (Object.keys(mds).includes(word)) {

					return new vscode.Hover({
						value: `${word}
								${mds[word]}
								`
					});
					
	
				}
			}
		});


	});





//.......................

// create a decorator type that we use to decorate large numbers
const largeNumberDecorationType = function(color){
	//console.log(color);
	return vscode.window.createTextEditorDecorationType({
		cursor: 'crosshair',
		border: `2px solid ${color}`
		// before: { 
		// 			contentText: " ",
		// 			float: 'left',
		// 			height: '20px',
		// 			width: '20px',
		// 			backgroundColor: `${color}`
		// 		}
	});
}

let activeEditor = vscode.window.activeTextEditor;


function updateDecorations() {
	if (!activeEditor) {
		return;
	}
	const regEx = /([$](?:\w+-)+\w+)/g;
	const text = activeEditor.document.getText();
	//console.log(text);
	const largeNumbers = [];
	let match;
	let color;
	while (match = regEx.exec(text)) {
		//console.log(match);
		const startPos = activeEditor.document.positionAt(match.index);
		const endPos = activeEditor.document.positionAt(match.index + match[0].length);
		const decoration = { range: new vscode.Range(startPos, endPos), hoverMessage: 'MDS Constant :' + match[0] + ` = ${mds[match[0]]} **` };
		largeNumbers.push(decoration);
		//console.log(match[0], mds[match[0]]);
		color = mds[match[0]];

		if(color.startsWith('#')){
			activeEditor.setDecorations(largeNumberDecorationType(`${color}`), [decoration]);
		}
	}

}

function triggerUpdateDecorations() {
	if (timeout) {
		clearTimeout(timeout);
		timeout = undefined;
	}
	timeout = setTimeout(updateDecorations, 500);
}

if (activeEditor) {
	triggerUpdateDecorations();
}

vscode.window.onDidChangeActiveTextEditor(editor => {
	activeEditor = editor;
	if (editor) {
		triggerUpdateDecorations();
	}
}, null, context.subscriptions);

vscode.workspace.onDidChangeTextDocument(event => {
	if (activeEditor && event.document === activeEditor.document) {
		triggerUpdateDecorations();
	}
}, null, context.subscriptions);

	context.subscriptions.push(disposable);
	context.subscriptions.push(disposable2);

}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
