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
exports.sleep = exports.assertFirstTimeReceived = exports.withPolling = void 0;
function withPolling(callback, interval, timeout) {
    const pollingInterval = setInterval(() => callback(clearPolling), interval);
    const pollingTimeout = setTimeout(() => {
        clearInterval(pollingInterval);
    }, timeout);
    function clearPolling() {
        clearInterval(pollingInterval);
        clearTimeout(pollingTimeout);
    }
}
exports.withPolling = withPolling;
function assertFirstTimeReceived(key, context) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            if (!context.globalState.get(key)) {
                void context.globalState.update(key, true).then(resolve, reject);
            }
            else {
                reject(new Error("Already happened"));
            }
        });
    });
}
exports.assertFirstTimeReceived = assertFirstTimeReceived;
function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}
exports.sleep = sleep;
//# sourceMappingURL=utils.js.map