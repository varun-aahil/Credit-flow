"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const requests_1 = require("./binary/requests/requests");
const selectionHandler_1 = require("./selectionHandler");
const capabilities_1 = require("./capabilities");
const provideCompletionItems_1 = require("./provideCompletionItems");
const consts_1 = require("./consts");
const errorState_1 = require("./binary/errorState");
function activate(context) {
    requests_1.initBinary();
    handleSelection(context);
    const hover = vscode.languages.registerHoverProvider("python", {
        provideHover(document, position, token) {
            const wordRange = document.getWordRangeAtPosition(position);
            const word = document.getText(wordRange);
            const linePrefix = document.lineAt(position).text;
            const fnName0 = linePrefix.match(/^.*(?=\()/);
            const prefix = linePrefix.match(/(?<=\.)\w*(?=\()/);
            if (fnName0 !== null && prefix !== null && prefix[0] === word) {
                const fnNameArr = fnName0[0].split("=");
                const fnName1 = fnNameArr[fnNameArr.length - 1];
                if (fnName1 !== undefined) {
                    const fnName = fnName1.trim();
                    const mdStr = new vscode.MarkdownString();
                    let link = "https://psjdoc.e-technostar.com/";
                    if (fnName.includes("JPT.")) {
                        link = link + "docs/psj-utility/JPT." + fnName.split(".")[1];
                    }
                    else {
                        link =
                            link +
                                "docs/psj-command/" +
                                fnName
                                    .split(".")[0]
                                    .split(/(?=[A-Z][a-z])/)
                                    .map((s) => s.toLowerCase())
                                    .join("-") +
                                "/" +
                                fnName;
                    }
                    mdStr.appendMarkdown(`[See reference here](${link})`);
                    return new vscode.Hover(mdStr);
                }
            }
            else {
                return undefined;
            }
        },
    });
    context.subscriptions.push(hover);
    void backgroundInit(context);
    return Promise.resolve();
}
exports.activate = activate;
function backgroundInit(context) {
    return __awaiter(this, void 0, void 0, function* () {
        // Goes to the binary to fetch what capabilities enabled:
        yield capabilities_1.fetchCapabilitiesOnFocus();
        vscode.languages.registerCompletionItemProvider({ pattern: "**" }, {
            provideCompletionItems: provideCompletionItems_1.default,
        }, ...consts_1.COMPLETION_TRIGGERS);
        if (capabilities_1.isCapabilityEnabled(capabilities_1.Capability.ON_BOARDING_CAPABILITY)) {
            errorState_1.default();
        }
    });
}
function deactivate() {
    return __awaiter(this, void 0, void 0, function* () {
        return requests_1.deactivate();
    });
}
exports.deactivate = deactivate;
function handleSelection(context) {
    context.subscriptions.push(vscode.commands.registerTextEditorCommand(selectionHandler_1.COMPLETION_IMPORTS, selectionHandler_1.selectionHandler));
}
//# sourceMappingURL=extension.js.map