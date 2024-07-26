const vscode = require("vscode");
const fs = require("fs/promises");
const path = require("path");

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  let disposable = vscode.commands.registerCommand("website-starter-pack.newProject", async (uri) => {
    const projectName = await vscode.window.showInputBox({
      placeHolder: "Enter Project Name"
    });
    if (!projectName) {
      vscode.window.showErrorMessage("Project Name is mandatory");
      return;
    }

    const selectedFolderPath = uri.fsPath;
    const projectPath = path.join(selectedFolderPath, projectName);
    await fs.mkdir(projectPath);

    const projectFiles = ["index.html", "styles.css", "script.js"];

    for (const file of projectFiles) {
      await fs.writeFile(path.join(projectPath, file), "");
    }

    vscode.window.showInformationMessage(`Project '${projectName}' created successfully.`);
  });

  context.subscriptions.push(disposable);

  vscode.commands.executeCommand("setContext", "newProjectSupported", true);

  const executeHandler = (resource) => {
    vscode.commands.executeCommand("website-starter-pack.newProject", resource);
  };

  context.subscriptions.push(
    vscode.commands.registerCommand("website-starter-pack.newProjectFromContextMenu", executeHandler)
  );
}

function deactivate() {}

module.exports = {
  activate,
  deactivate
};
