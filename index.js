#!/usr/bin/env node
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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var clear_1 = __importDefault(require("clear"));
var prompts_1 = __importDefault(require("prompts"));
var fs_1 = __importDefault(require("fs"));
var exec_sh_1 = __importDefault(require("exec-sh"));
var colors_1 = __importDefault(require("colors"));
var cli_spinners_1 = __importDefault(require("cli-spinners"));
var log_update_async_hook_1 = __importDefault(require("log-update-async-hook"));
var ArgoCli = /** @class */ (function () {
    function ArgoCli() {
        this.menu();
    }
    ArgoCli.prototype.menu = function () {
        return __awaiter(this, void 0, void 0, function () {
            var action;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        (0, clear_1.default)();
                        return [4 /*yield*/, (0, prompts_1.default)({
                                type: 'select',
                                name: 'action',
                                message: 'What do you want to do?',
                                choices: [
                                    { title: 'Start a new project', value: 'init', },
                                ],
                            })];
                    case 1:
                        action = (_a.sent()).action;
                        this["action_".concat(action)]();
                        return [2 /*return*/];
                }
            });
        });
    };
    /* ========================================= ACTIONS ========================================== */
    ArgoCli.prototype.action_init = function () {
        return __awaiter(this, void 0, void 0, function () {
            var name, modules, progress;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, prompts_1.default)({
                            type: 'text',
                            name: 'name',
                            message: 'What is the name of the project? (Leave blank to start in current directory)',
                        })];
                    case 1:
                        name = (_a.sent()).name;
                        return [4 /*yield*/, this.selectModules()];
                    case 2:
                        modules = _a.sent();
                        progress = [];
                        if (modules.includes('orm')) {
                            if (!fs_1.default.existsSync(name)) {
                                fs_1.default.mkdirSync(name);
                            }
                            else {
                                this.error("A directory named \"".concat(name, "\" already exists"));
                            }
                            progress.push({
                                message: 'Starting TypeORM...',
                                handler: function () {
                                    return exec_sh_1.default.promise('npx typeorm init --database mysql', { cwd: name, detached: true, });
                                },
                            });
                        }
                        this.progress(progress, 'Project created!');
                        return [2 /*return*/];
                }
            });
        });
    };
    /* ===================================== SHARED METHODS ====================================== */
    ArgoCli.prototype.selectModules = function () {
        return this.selectModule();
    };
    ArgoCli.prototype.selectModule = function (message) {
        return __awaiter(this, void 0, void 0, function () {
            var modules;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, prompts_1.default)({
                            type: 'multiselect',
                            name: 'modules',
                            message: message || 'Which modules will be used?',
                            choices: [
                                { title: 'Server', value: 'server', disabled: true, },
                                { title: 'ORM', value: 'orm', },
                                { title: 'Mail', value: 'mail', disabled: true, },
                                { title: 'PDF', value: 'pdf', disabled: true, },
                            ],
                        })];
                    case 1:
                        modules = (_a.sent()).modules;
                        return [2 /*return*/, modules];
                }
            });
        });
    };
    ArgoCli.prototype.error = function (message) {
        console.log(colors_1.default.red.bold(this.symbol('error') + message));
        process.exit();
    };
    ArgoCli.prototype.symbol = function (message) {
        switch (message) {
            case 'error':
            case 'cancel':
                return '✘ ';
                break;
            case 'success':
            case 'check':
                return '✔ ';
                break;
            case 'alert':
            case 'warn':
            case 'warning':
                return '⚠ ';
                break;
            default: return '✔ ';
        }
    };
    ArgoCli.prototype.progress = function (messages, finalMessage) {
        return __awaiter(this, void 0, void 0, function () {
            function processMessages(messages) {
                return __awaiter(this, void 0, void 0, function () {
                    var messageObject;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                messageObject = messages.shift();
                                message = ' ' + messageObject.message;
                                return [4 /*yield*/, messageObject.handler()];
                            case 1:
                                _a.sent();
                                if (messages.length > 0) {
                                    return [2 /*return*/, processMessages(messages)];
                                }
                                return [2 /*return*/];
                        }
                    });
                });
            }
            var frames, i, message, id;
            return __generator(this, function (_a) {
                frames = cli_spinners_1.default.aesthetic.frames;
                i = 0;
                message = '';
                console.log();
                processMessages(messages).then(function () {
                    clearInterval(id);
                    (0, log_update_async_hook_1.default)("".concat(frames[6], "  ").concat(finalMessage || 'Done!'));
                    log_update_async_hook_1.default.done();
                    console.log();
                });
                id = setInterval(function () {
                    var frame = frames[i = ++i % frames.length];
                    (0, log_update_async_hook_1.default)("".concat(frame, " ").concat(message));
                }, cli_spinners_1.default.aesthetic.interval);
                return [2 /*return*/];
            });
        });
    };
    return ArgoCli;
}());
new ArgoCli();
//# sourceMappingURL=index.js.map