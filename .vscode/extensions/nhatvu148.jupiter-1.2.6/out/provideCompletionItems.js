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
const vscode = require("vscode");
const requests_1 = require("./binary/requests/requests");
const capabilities_1 = require("./capabilities");
const consts_1 = require("./consts");
const selectionHandler_1 = require("./selectionHandler");
const INCOMPLETE = true;
function provideCompletionItems(document, position) {
    return __awaiter(this, void 0, void 0, function* () {
        return new vscode.CompletionList(yield completionsListFor(document, position), INCOMPLETE);
    });
}
exports.default = provideCompletionItems;
function completionsListFor(document, position) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!completionIsAllowed(document, position)) {
                return [];
            }
            const offset = document.offsetAt(position);
            const beforeStartOffset = Math.max(0, offset - consts_1.CHAR_LIMIT);
            const afterEndOffset = offset + consts_1.CHAR_LIMIT;
            const beforeStart = document.positionAt(beforeStartOffset);
            const afterEnd = document.positionAt(afterEndOffset);
            const response = yield requests_1.autocomplete({
                filename: document.fileName,
                before: document.getText(new vscode.Range(beforeStart, position)),
                after: document.getText(new vscode.Range(position, afterEnd)),
                region_includes_beginning: beforeStartOffset === 0,
                region_includes_end: document.offsetAt(afterEnd) !== afterEndOffset,
                max_num_results: getMaxResults(),
            });
            if (!response || (response === null || response === void 0 ? void 0 : response.results.length) === 0) {
                return [];
            }
            const limit = showFew(response, document, position)
                ? 1
                : response.results.length;
            return response.results.slice(0, limit).map((entry, index) => makeCompletionItem({
                document,
                index,
                position,
                detailMessage: extractDetailMessage(response),
                oldPrefix: response === null || response === void 0 ? void 0 : response.old_prefix,
                entry,
                results: response === null || response === void 0 ? void 0 : response.results,
            }));
        }
        catch (e) {
            console.error(`Error setting up request: ${e}`);
            return [];
        }
    });
}
function extractDetailMessage(response) {
    return (response.user_message || []).join("\n") || consts_1.DEFAULT_DETAIL;
}
function makeCompletionItem(args) {
    const item = new vscode.CompletionItem(consts_1.ATTRIBUTION_BRAND + args.entry.new_prefix);
    item.detail = args.entry.detail
        ? consts_1.BRAND_NAME + "    " + args.entry.detail
        : consts_1.BRAND_NAME;
    item.sortText = String.fromCharCode(0) + String.fromCharCode(args.index);
    item.insertText = new vscode.SnippetString(escapeTabStopSign(args.entry.new_prefix));
    item.filterText = args.entry.new_prefix;
    item.preselect = args.index === 0;
    item.kind = args.entry.kind;
    item.range = new vscode.Range(args.position.translate(0, -args.oldPrefix.length), args.position.translate(0, args.entry.old_suffix.length));
    item.command = {
        arguments: [
            {
                currentCompletion: args.entry.new_prefix,
                completions: args.results,
                position: args.position,
            },
        ],
        command: selectionHandler_1.COMPLETION_IMPORTS,
        title: "accept completion",
    };
    if (args.entry.new_suffix) {
        item.insertText
            .appendTabstop(0)
            .appendText(escapeTabStopSign(args.entry.new_suffix));
    }
    if (args.entry.documentation) {
        item.documentation = formatDocumentation(args.entry.documentation);
    }
    return item;
}
function getMaxResults() {
    if (capabilities_1.isCapabilityEnabled(capabilities_1.Capability.SUGGESTIONS_SINGLE)) {
        return 1;
    }
    if (capabilities_1.isCapabilityEnabled(capabilities_1.Capability.SUGGESTIONS_TWO)) {
        return 2;
    }
    return consts_1.MAX_NUM_RESULTS;
}
function formatDocumentation(documentation) {
    if (isMarkdownStringSpec(documentation)) {
        if (documentation.kind === "markdown") {
            return new vscode.MarkdownString(documentation.value);
        }
        return documentation.value;
    }
    return documentation;
}
function escapeTabStopSign(value) {
    return value.replace(new RegExp("\\$", "g"), "\\$");
}
function isMarkdownStringSpec(x) {
    return !(typeof x === "string");
}
function completionIsAllowed(document, position) {
    const configuration = vscode.workspace.getConfiguration();
    let disableLineRegex = configuration.get("jupiter.disable_line_regex");
    if (disableLineRegex === undefined) {
        disableLineRegex = [];
    }
    const line = document.getText(new vscode.Range(position.with({ character: 0 }), position.with({ character: 500 })));
    if (disableLineRegex.some((r) => new RegExp(r).test(line))) {
        return false;
    }
    let disableFileRegex = configuration.get("jupiter.disable_file_regex");
    if (disableFileRegex === undefined) {
        disableFileRegex = [];
    }
    if (disableFileRegex.some((r) => new RegExp(r).test(document.fileName))) {
        return false;
    }
    return true;
}
function showFew(response, document, position) {
    if (response.results.some((entry) => entry.kind || entry.documentation)) {
        return false;
    }
    const leftPoint = position.translate(0, -response.old_prefix.length);
    const tail = document.getText(new vscode.Range(document.lineAt(leftPoint).range.start, leftPoint));
    return tail.endsWith(".") || tail.endsWith("::");
}
//# sourceMappingURL=provideCompletionItems.js.map