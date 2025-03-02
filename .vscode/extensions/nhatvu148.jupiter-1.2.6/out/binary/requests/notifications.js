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
exports.sendNotificationAction = exports.getNotifications = exports.NotificationActions = void 0;
const requests_1 = require("./requests");
var NotificationActions;
(function (NotificationActions) {
    NotificationActions[NotificationActions["NONE"] = 0] = "NONE";
})(NotificationActions = exports.NotificationActions || (exports.NotificationActions = {}));
function getNotifications() {
    return requests_1.jupiterProcess.request({ Notifications: {} });
}
exports.getNotifications = getNotifications;
function sendNotificationAction(id, selected) {
    return __awaiter(this, void 0, void 0, function* () {
        return requests_1.jupiterProcess.request({
            NotificationAction: { id, selected },
        });
    });
}
exports.sendNotificationAction = sendNotificationAction;
//# sourceMappingURL=notifications.js.map