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
exports.getCapabilities = exports.uninstalling = exports.deactivate = exports.getState = exports.configuration = exports.autocomplete = exports.initBinary = exports.jupiterProcess = void 0;
const Binary_1 = require("../Binary");
exports.jupiterProcess = new Binary_1.default();
function initBinary() {
    exports.jupiterProcess.init();
}
exports.initBinary = initBinary;
function autocomplete(requestData) {
    return exports.jupiterProcess.request({
        Autocomplete: requestData,
    });
}
exports.autocomplete = autocomplete;
function configuration(body = {}) {
    return exports.jupiterProcess.request({
        Configuration: body,
    }, 5000);
}
exports.configuration = configuration;
function getState(content = {}) {
    return exports.jupiterProcess.request({ State: content });
}
exports.getState = getState;
function deactivate() {
    if (exports.jupiterProcess) {
        return exports.jupiterProcess.request({ Deactivate: {} });
    }
    console.error("No Jupiter process");
    return Promise.resolve(null);
}
exports.deactivate = deactivate;
function uninstalling() {
    return exports.jupiterProcess.request({ Uninstalling: {} });
}
exports.uninstalling = uninstalling;
function getCapabilities() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield exports.jupiterProcess.request({ Features: {} }, 7000);
            if (!Array.isArray(result === null || result === void 0 ? void 0 : result.enabled_features)) {
                throw new Error("Could not get enabled capabilities");
            }
            return result;
        }
        catch (error) {
            console.error(error);
            return { enabled_features: [] };
        }
    });
}
exports.getCapabilities = getCapabilities;
//# sourceMappingURL=requests.js.map