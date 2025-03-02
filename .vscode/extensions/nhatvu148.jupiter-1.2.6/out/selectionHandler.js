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
exports.selectionHandler = exports.COMPLETION_IMPORTS = void 0;
const vscode_1 = require("vscode");
const findImports_1 = require("./findImports");
const CompletionOrigin_1 = require("./CompletionOrigin");
const consts_1 = require("./consts");
const setState_1 = require("./binary/requests/setState");
exports.COMPLETION_IMPORTS = "jupiter-completion-imports";
function selectionHandler(editor, edit, { currentCompletion, completions, position }) {
    try {
        const eventData = eventDataOf(completions, currentCompletion, editor, position);
        void setState_1.default(eventData);
        void handleImports(editor, currentCompletion);
    }
    catch (error) {
        console.error(error);
    }
}
exports.selectionHandler = selectionHandler;
function eventDataOf(completions, currentCompletion, editor, position) {
    const index = completions.findIndex(({ new_prefix: newPrefix }) => newPrefix === currentCompletion);
    let numOfVanillaSuggestions = 0;
    let numOfDeepLocalSuggestions = 0;
    let numOfDeepCloudSuggestions = 0;
    let numOfLspSuggestions = 0;
    const currInCompletions = completions[index];
    const suggestions = completions.map((c) => {
        var _a;
        if (c.origin === CompletionOrigin_1.default.VANILLA) {
            numOfVanillaSuggestions += 1;
        }
        else if (c.origin === CompletionOrigin_1.default.LOCAL) {
            numOfDeepLocalSuggestions += 1;
        }
        else if (c.origin === CompletionOrigin_1.default.CLOUD) {
            numOfDeepCloudSuggestions += 1;
        }
        else if (c.origin === CompletionOrigin_1.default.LSP) {
            numOfLspSuggestions += 1;
        }
        return {
            length: c.new_prefix.length,
            strength: resolveDetailOf(c),
            origin: (_a = c.origin) !== null && _a !== void 0 ? _a : CompletionOrigin_1.default.UNKNOWN,
        };
    });
    const { length } = currentCompletion;
    const netLength = editor.selection.anchor.character - position.character;
    const strength = resolveDetailOf(currInCompletions);
    const { origin } = currInCompletions;
    const prefixLength = editor.document
        .getText(new vscode_1.Range(new vscode_1.Position(position.line, 0), position))
        .trimLeft().length;
    const netPrefixLength = prefixLength - (currentCompletion.length - netLength);
    const suffixLength = editor.document.lineAt(position).text.trim().length -
        (prefixLength + netLength);
    const numOfSuggestions = completions.length;
    const eventData = {
        Selection: {
            language: extractLanguage(editor),
            length,
            net_length: netLength,
            strength,
            origin: origin !== null && origin !== void 0 ? origin : CompletionOrigin_1.default.UNKNOWN,
            index,
            line_prefix_length: prefixLength,
            line_net_prefix_length: netPrefixLength,
            line_suffix_length: suffixLength,
            num_of_suggestions: numOfSuggestions,
            num_of_vanilla_suggestions: numOfVanillaSuggestions,
            num_of_deep_local_suggestions: numOfDeepLocalSuggestions,
            num_of_deep_cloud_suggestions: numOfDeepCloudSuggestions,
            num_of_lsp_suggestions: numOfLspSuggestions,
            suggestions,
        },
    };
    return eventData;
}
function resolveDetailOf(completion) {
    if (completion.origin === CompletionOrigin_1.default.LSP) {
        return "";
    }
    return completion.detail;
}
function extractLanguage(editor) {
    var _a;
    const fileNameElements = editor.document.fileName.split(".");
    return ((_a = fileNameElements[Math.max(1, fileNameElements.length - 1)]) !== null && _a !== void 0 ? _a : "undefined");
}
function handleImports(editor, completion) {
    const { selection } = editor;
    const completionSelection = new vscode_1.Selection(selection.active.translate(0, -completion.length), selection.active);
    setTimeout(() => {
        void doAutoImport(editor, completionSelection, completion);
    }, consts_1.DELAY_FOR_CODE_ACTION_PROVIDER);
}
function doAutoImport(editor, completionSelection, completion) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const codeActionCommands = yield vscode_1.commands.executeCommand("vscode.executeCodeActionProvider", editor.document.uri, completionSelection, vscode_1.CodeActionKind.QuickFix);
            const importCommand = findImports_1.default(codeActionCommands)[0];
            if (importCommand && importCommand.edit) {
                yield vscode_1.workspace.applyEdit(importCommand.edit);
                yield vscode_1.commands.executeCommand(exports.COMPLETION_IMPORTS, { completion });
            }
        }
        catch (error) {
            console.error(error);
        }
    });
}
//# sourceMappingURL=selectionHandler.js.map