"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fetchBinaryPath_1 = require("./fetchBinaryPath");
const runProcess_1 = require("./runProcess");
function runBinary(additionalArgs = [], inheritStdio = false) {
    const command = fetchBinaryPath_1.default();
    const args = [
        "--client=vscode",
        "--no-lsp=true",
        "--client-metadata",
        ...additionalArgs,
    ].filter((i) => i !== null);
    return runProcess_1.runProcess(command, args, {
        stdio: inheritStdio ? "inherit" : "pipe",
    });
}
exports.default = runBinary;
//# sourceMappingURL=runBinary.js.map