"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.restartBackoff = exports.StatePayload = exports.StateType = exports.COMPLETION_TRIGGERS = exports.DEFAULT_DETAIL = exports.BRAND_NAME = exports.MINIMAL_SUPPORTED_VSCODE_API = exports.INSTALL_COMMAND = exports.OPEN_LP_FROM_STATUS_BAR = exports.STATUS_BAR_NOTIFICATION_PERIOD = exports.BINARY_STATUS_BAR_FIRST_MESSAGE_POLLING_INTERVAL = exports.BINARY_STATUS_BAR_POLLING_INTERVAL = exports.BINARY_NOTIFICATION_POLLING_INTERVAL = exports.DELAY_FOR_CODE_ACTION_PROVIDER = exports.WAIT_BEFORE_RESTART_MILLIS = exports.REQUEST_FAILURES_THRESHOLD = exports.CONSECUTIVE_RESTART_THRESHOLD = exports.MAX_NUM_RESULTS = exports.CHAR_LIMIT = exports.ATTRIBUTION_BRAND = exports.BINARY_ROOT_PATH = exports.API_VERSION = void 0;
const path = require("path");
exports.API_VERSION = "1.1.9";
exports.BINARY_ROOT_PATH = path.join(__dirname, "..", "binaries");
exports.ATTRIBUTION_BRAND = "⚝ ";
exports.CHAR_LIMIT = 100000;
exports.MAX_NUM_RESULTS = 5;
exports.CONSECUTIVE_RESTART_THRESHOLD = 100;
exports.REQUEST_FAILURES_THRESHOLD = 20;
exports.WAIT_BEFORE_RESTART_MILLIS = 1000; // 1 second
exports.DELAY_FOR_CODE_ACTION_PROVIDER = 800;
// Env variable is to make the tests faster. It is not set in production environment.
exports.BINARY_NOTIFICATION_POLLING_INTERVAL = +(process.env.BINARY_NOTIFICATION_POLLING_INTERVAL || 10000); // 10 seconds
exports.BINARY_STATUS_BAR_POLLING_INTERVAL = +(process.env.BINARY_STATUS_BAR_POLLING_INTERVAL || 60 * 60 * 1000); // one hour
exports.BINARY_STATUS_BAR_FIRST_MESSAGE_POLLING_INTERVAL = +(process.env.BINARY_NOTIFICATION_POLLING_INTERVAL || 10000); // 10 seconds
exports.STATUS_BAR_NOTIFICATION_PERIOD = +(process.env.STATUS_BAR_NOTIFICATION_PERIOD || 2 * 60 * 1000); // 2 minutes
exports.OPEN_LP_FROM_STATUS_BAR = "jupiter:open_lp";
exports.INSTALL_COMMAND = "workbench.extensions.installExtension";
exports.MINIMAL_SUPPORTED_VSCODE_API = "1.35.0";
exports.BRAND_NAME = "Jupiter's hint";
exports.DEFAULT_DETAIL = exports.BRAND_NAME;
exports.COMPLETION_TRIGGERS = [
    " ",
    ".",
    "(",
    ")",
    "{",
    "}",
    "[",
    "]",
    ",",
    ":",
    "'",
    '"',
    "=",
    "<",
    ">",
    "/",
    "\\",
    "+",
    "-",
    "|",
    "&",
    "*",
    "%",
    "=",
    "$",
    "#",
    "@",
    "!",
];
var StateType;
(function (StateType) {
    StateType["ERROR"] = "error";
    StateType["INFO"] = "info";
    StateType["PROGRESS"] = "progress";
    StateType["STATUS"] = "status";
    StateType["PALLETTE"] = "pallette";
    StateType["NOTIFICATION"] = "notification";
})(StateType = exports.StateType || (exports.StateType = {}));
var StatePayload;
(function (StatePayload) {
    StatePayload["MESSAGE"] = "Message";
    StatePayload["STATE"] = "State";
    StatePayload["NOTIFICATION_SHOWN"] = "NotificationShown";
    StatePayload["STATUS_SHOWN"] = "StatusShown";
})(StatePayload = exports.StatePayload || (exports.StatePayload = {}));
const SLEEP_TIME_BETWEEN_ATTEMPTS = 1000; // 1 second
const MAX_SLEEP_TIME_BETWEEN_ATTEMPTS = 60 * 60 * 1000; // 1 hour
function restartBackoff(attempt) {
    return Math.min(SLEEP_TIME_BETWEEN_ATTEMPTS * Math.pow(2, Math.min(attempt, 10)), MAX_SLEEP_TIME_BETWEEN_ATTEMPTS);
}
exports.restartBackoff = restartBackoff;
//# sourceMappingURL=consts.js.map