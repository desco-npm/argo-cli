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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var clear_1 = __importDefault(require("clear"));
var prompts_1 = __importDefault(require("prompts"));
var fs_extra_1 = __importDefault(require("fs-extra"));
var exec_sh_1 = __importDefault(require("exec-sh"));
var colors_1 = __importDefault(require("colors"));
var cli_spinners_1 = __importDefault(require("cli-spinners"));
var log_update_async_hook_1 = __importDefault(require("log-update-async-hook"));
var path_1 = __importDefault(require("path"));
var ArgoCli = /** @class */ (function () {
    function ArgoCli() {
        this.argoDir = __dirname;
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
            var configure, createDir, createSrcDir, prepareORM, prepareServer, indexModules, finalPreparations, config, pathDir, pathSrcDir, progress;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        configure = function () { return __awaiter(_this, void 0, void 0, function () {
                            var name, modules, serverPort, _a, ormDb, _b, ormDbHost, _c, ormDbPort, _d, ormDbName, _e, ormDbUser, _f, ormDbPassword, _g, pathDir, pathSrcDir;
                            return __generator(this, function (_h) {
                                switch (_h.label) {
                                    case 0: return [4 /*yield*/, (0, prompts_1.default)({
                                            type: 'text',
                                            name: 'name',
                                            message: 'What is the name of the project?',
                                        })];
                                    case 1:
                                        name = (_h.sent()).name;
                                        return [4 /*yield*/, this.selectModules()];
                                    case 2:
                                        modules = _h.sent();
                                        if (!modules.includes('server')) return [3 /*break*/, 4];
                                        return [4 /*yield*/, (0, prompts_1.default)({
                                                type: 'number',
                                                name: 'serverPort',
                                                message: 'Which port will the server use?',
                                                initial: 3000,
                                            })];
                                    case 3:
                                        _a = _h.sent();
                                        return [3 /*break*/, 5];
                                    case 4:
                                        _a = null;
                                        _h.label = 5;
                                    case 5:
                                        serverPort = (_a).serverPort;
                                        if (!modules.includes('orm')) return [3 /*break*/, 7];
                                        return [4 /*yield*/, this.selectOneDb('Which databases will be used with ORM?')];
                                    case 6:
                                        _b = _h.sent();
                                        return [3 /*break*/, 8];
                                    case 7:
                                        _b = null;
                                        _h.label = 8;
                                    case 8:
                                        ormDb = _b;
                                        if (!modules.includes('orm')) return [3 /*break*/, 10];
                                        return [4 /*yield*/, (0, prompts_1.default)({
                                                type: 'text',
                                                name: 'ormDbHost',
                                                message: 'Which host will be used by the ORM database?',
                                                initial: 'localhost',
                                            })];
                                    case 9:
                                        _c = _h.sent();
                                        return [3 /*break*/, 11];
                                    case 10:
                                        _c = null;
                                        _h.label = 11;
                                    case 11:
                                        ormDbHost = (_c).ormDbHost;
                                        if (!modules.includes('orm')) return [3 /*break*/, 13];
                                        return [4 /*yield*/, (0, prompts_1.default)({
                                                type: 'text',
                                                name: 'ormDbPort',
                                                message: 'Which port will be used by the ORM database?',
                                            })];
                                    case 12:
                                        _d = _h.sent();
                                        return [3 /*break*/, 14];
                                    case 13:
                                        _d = null;
                                        _h.label = 14;
                                    case 14:
                                        ormDbPort = (_d).ormDbPort;
                                        if (!modules.includes('orm')) return [3 /*break*/, 16];
                                        return [4 /*yield*/, (0, prompts_1.default)({
                                                type: 'text',
                                                name: 'ormDbName',
                                                message: 'What will be the name of the ORM database?',
                                            })];
                                    case 15:
                                        _e = _h.sent();
                                        return [3 /*break*/, 17];
                                    case 16:
                                        _e = null;
                                        _h.label = 17;
                                    case 17:
                                        ormDbName = (_e).ormDbName;
                                        if (!modules.includes('orm')) return [3 /*break*/, 19];
                                        return [4 /*yield*/, (0, prompts_1.default)({
                                                type: 'text',
                                                name: 'ormDbUser',
                                                message: 'Which user will be used by the ORM database?',
                                            })];
                                    case 18:
                                        _f = _h.sent();
                                        return [3 /*break*/, 20];
                                    case 19:
                                        _f = null;
                                        _h.label = 20;
                                    case 20:
                                        ormDbUser = (_f).ormDbUser;
                                        if (!modules.includes('orm')) return [3 /*break*/, 22];
                                        return [4 /*yield*/, (0, prompts_1.default)({
                                                type: 'password',
                                                name: 'ormDbPassword',
                                                message: 'Which password will be used by the ORM database?',
                                            })];
                                    case 21:
                                        _g = _h.sent();
                                        return [3 /*break*/, 23];
                                    case 22:
                                        _g = null;
                                        _h.label = 23;
                                    case 23:
                                        ormDbPassword = (_g).ormDbPassword;
                                        pathDir = path_1.default.resolve(name);
                                        pathSrcDir = path_1.default.resolve(path_1.default.join(name, 'src'));
                                        return [2 /*return*/, {
                                                name: name,
                                                modules: modules,
                                                ormDb: ormDb,
                                                ormDbHost: ormDbHost,
                                                ormDbPort: ormDbPort,
                                                ormDbName: ormDbName,
                                                ormDbUser: ormDbUser,
                                                ormDbPassword: ormDbPassword,
                                                serverPort: serverPort,
                                                pathDir: pathDir,
                                                pathSrcDir: pathSrcDir,
                                            }];
                                }
                            });
                        }); };
                        createDir = function (name) {
                            if (!fs_extra_1.default.existsSync(name)) {
                                fs_extra_1.default.mkdirSync(name);
                            }
                            else {
                                _this.error("A directory named \"".concat(name, "\" already exists"));
                            }
                        };
                        createSrcDir = function () {
                            if (!fs_extra_1.default.existsSync(pathSrcDir)) {
                                fs_extra_1.default.mkdirSync(pathSrcDir);
                            }
                        };
                        prepareORM = function (pathDir, pathSrcDir, config) {
                            return {
                                message: 'Installing TypeORM...',
                                handler: function () { return __awaiter(_this, void 0, void 0, function () {
                                    var ormconfigJsonAddrs, ormconfigTsAddrs, ormconfig, ormconfigString;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, exec_sh_1.default.promise('npx typeorm init --database ' + config.ormDb, {
                                                    cwd: pathDir,
                                                    detached: true,
                                                })];
                                            case 1:
                                                _a.sent();
                                                return [4 /*yield*/, fs_extra_1.default.unlinkSync(path_1.default.join(pathSrcDir, 'index.ts'))];
                                            case 2:
                                                _a.sent();
                                                return [4 /*yield*/, fs_extra_1.default.copySync(path_1.default.join(this.argoDir, 'models', 'orm'), path_1.default.join(pathSrcDir, 'orm'))];
                                            case 3:
                                                _a.sent();
                                                ormconfigJsonAddrs = path_1.default.join(pathDir, 'ormconfig.json');
                                                ormconfigTsAddrs = path_1.default.join(pathDir, 'ormconfig.ts');
                                                ormconfig = require(ormconfigJsonAddrs);
                                                ormconfig.entities[0] = ormconfig.entities[0].replace('.ts', '.js');
                                                if (config.ormDbHost) {
                                                    ormconfig.host = config.ormDbHost;
                                                }
                                                if (config.ormDbPort) {
                                                    ormconfig.port = config.ormDbPort;
                                                }
                                                if (config.ormDbName) {
                                                    ormconfig.database = config.ormDbName;
                                                }
                                                if (config.ormDbUser) {
                                                    ormconfig.username = config.ormDbUser;
                                                }
                                                if (config.ormDbPassword) {
                                                    ormconfig.password = config.ormDbPassword;
                                                }
                                                return [4 /*yield*/, fs_extra_1.default.appendFileSync(path_1.default.join(pathDir, '.env'), ("TYPEORM_DB_TYPE=".concat(ormconfig.type, "\n") +
                                                        "TYPEORM_DB_HOST=".concat(ormconfig.host, "\n") +
                                                        "TYPEORM_DB_PORT=".concat(ormconfig.port, "\n") +
                                                        "TYPEORM_DB_NAME=".concat(ormconfig.database, "\n") +
                                                        "TYPEORM_DB_USER=".concat(ormconfig.username, "\n") +
                                                        "TYPEORM_DB_PASSWORD=".concat(ormconfig.password, "\n\n")))];
                                            case 4:
                                                _a.sent();
                                                ormconfig.type = '[[TYPE]]';
                                                ormconfig.host = '[[HOST]]';
                                                ormconfig.port = '[[PORT]]';
                                                ormconfig.database = '[[DATABASE]]';
                                                ormconfig.username = '[[USERNAME]]';
                                                ormconfig.password = '[[PASSWORD]]';
                                                return [4 /*yield*/, fs_extra_1.default.unlinkSync(ormconfigJsonAddrs)];
                                            case 5:
                                                _a.sent();
                                                ormconfigString = JSON.stringify(ormconfig, null, 2)
                                                    .replace('"[[TYPE]]"', 'process.env.TYPEORM_DB_TYPE')
                                                    .replace('"[[HOST]]"', 'process.env.TYPEORM_DB_HOST')
                                                    .replace('"[[PORT]]"', 'process.env.TYPEORM_DB_PORT')
                                                    .replace('"[[DATABASE]]"', 'process.env.TYPEORM_DB_NAME')
                                                    .replace('"[[USERNAME]]"', 'process.env.TYPEORM_DB_USER')
                                                    .replace('"[[PASSWORD]]"', 'process.env.TYPEORM_DB_PASSWORD');
                                                return [4 /*yield*/, fs_extra_1.default.writeFileSync(ormconfigTsAddrs, 'require(\'dotenv\').config()\n\n' +
                                                        'export default ' + ormconfigString)];
                                            case 6:
                                                _a.sent();
                                                return [2 /*return*/];
                                        }
                                    });
                                }); },
                            };
                        };
                        prepareServer = function (pathDir, pathSrcDir, config) {
                            return {
                                message: 'Installing Express...',
                                handler: function () { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                createSrcDir();
                                                return [4 /*yield*/, exec_sh_1.default.promise('npm install --save express', {
                                                        cwd: pathDir,
                                                        detached: true,
                                                    })];
                                            case 1:
                                                _a.sent();
                                                return [4 /*yield*/, fs_extra_1.default.copySync(path_1.default.join(this.argoDir, 'models', 'server'), path_1.default.join(pathSrcDir, 'server'))];
                                            case 2:
                                                _a.sent();
                                                return [4 /*yield*/, fs_extra_1.default.appendFileSync(path_1.default.join(pathDir, '.env'), ("EXPRESS_PORT=".concat(config.serverPort, "\n")))];
                                            case 3:
                                                _a.sent();
                                                return [2 /*return*/];
                                        }
                                    });
                                }); },
                            };
                        };
                        indexModules = function (pathSrcDir, config) {
                            return {
                                message: 'Indexing modules...',
                                handler: function () { return __awaiter(_this, void 0, void 0, function () {
                                    var imports, execs, code;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                imports = [];
                                                execs = [];
                                                config.modules.map(function (module) { return imports.push("import ".concat(module, " from './").concat(module, "'")); });
                                                config.modules.map(function (module) { return execs.push("  await ".concat(module, "()")); });
                                                code = __spreadArray(__spreadArray(__spreadArray(__spreadArray([], imports, true), [
                                                    '',
                                                    '(async () => {'
                                                ], false), execs, true), [
                                                    '})()',
                                                ], false);
                                                return [4 /*yield*/, fs_extra_1.default.appendFileSync(path_1.default.join(pathSrcDir, 'index.ts'), code.join('\n'))];
                                            case 1:
                                                _a.sent();
                                                return [2 /*return*/];
                                        }
                                    });
                                }); },
                            };
                        };
                        finalPreparations = function (pathDir) {
                            return {
                                message: 'Final preparations...',
                                handler: function () { return __awaiter(_this, void 0, void 0, function () {
                                    var packageJsonAddrs, packagesJson;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                packageJsonAddrs = path_1.default.join(pathDir, 'package.json');
                                                return [4 /*yield*/, exec_sh_1.default.promise('npm install --save nodemon ts-node typescript dotenv', {
                                                        cwd: pathDir,
                                                        detached: true,
                                                    })];
                                            case 1:
                                                _a.sent();
                                                packagesJson = require(packageJsonAddrs);
                                                packagesJson.scripts = {
                                                    'build': 'tsc',
                                                    'build:watch': 'tsc --watch',
                                                    'start': 'nodemon ./src',
                                                    'start:watch': 'nodemon ./src --watch',
                                                    'start:ts': 'ts-node src/index.ts',
                                                    'start:ts:watch': 'ts-node src/index.ts --watch',
                                                };
                                                return [4 /*yield*/, fs_extra_1.default.writeFileSync(packageJsonAddrs, JSON.stringify(packagesJson, null, 2))];
                                            case 2:
                                                _a.sent();
                                                return [4 /*yield*/, fs_extra_1.default.unlinkSync(path_1.default.join(pathDir, 'tsconfig.json'))];
                                            case 3:
                                                _a.sent();
                                                return [4 /*yield*/, fs_extra_1.default.copySync(path_1.default.join(this.argoDir, 'tsconfig.json'), path_1.default.join(pathDir, 'tsconfig.json'))];
                                            case 4:
                                                _a.sent();
                                                return [2 /*return*/];
                                        }
                                    });
                                }); },
                            };
                        };
                        return [4 /*yield*/, configure()];
                    case 1:
                        config = _a.sent();
                        pathDir = path_1.default.resolve(config.name);
                        pathSrcDir = path_1.default.resolve(path_1.default.join(config.name, 'src'));
                        progress = [];
                        createDir(pathDir);
                        if (config.modules.includes('orm')) {
                            progress.push(prepareORM(pathDir, pathSrcDir, config));
                        }
                        if (config.modules.includes('server')) {
                            progress.push(prepareServer(pathDir, pathSrcDir, config));
                        }
                        progress.push(indexModules(pathSrcDir, config));
                        progress.push(finalPreparations(pathDir));
                        this.progress(progress, 'Project created!');
                        return [2 /*return*/];
                }
            });
        });
    };
    /* ===================================== SHARED METHODS ====================================== */
    ArgoCli.prototype.selectModules = function (message) {
        return this.selectModule(message, { multi: true, });
    };
    ArgoCli.prototype.selectOneModule = function (message) {
        return this.selectModule(message, { multi: false, });
    };
    ArgoCli.prototype.selectModule = function (message, params) {
        return __awaiter(this, void 0, void 0, function () {
            var modules;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, prompts_1.default)({
                            type: (params === null || params === void 0 ? void 0 : params.multi) ? 'multiselect' : 'select',
                            name: 'modules',
                            message: message || 'Which modules will be used?',
                            choices: [
                                {
                                    title: 'Express',
                                    description: 'Allows you to create a server to receive and respond to requests',
                                    value: 'server',
                                },
                                {
                                    title: 'TypeORM',
                                    description: ('Structure the code into entities that intelligently communicate with database tables'),
                                    value: 'orm',
                                },
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
    ArgoCli.prototype.selectDbs = function (message) {
        return this.selectDb(message, { multi: true, });
    };
    ArgoCli.prototype.selectOneDb = function (message) {
        return this.selectDb(message, { multi: false, });
    };
    ArgoCli.prototype.selectDb = function (message, params) {
        return __awaiter(this, void 0, void 0, function () {
            var dbs;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, prompts_1.default)({
                            type: (params === null || params === void 0 ? void 0 : params.multi) ? 'multiselect' : 'select',
                            name: 'dbs',
                            message: message || 'Which databases will be used?',
                            choices: [
                                {
                                    title: 'MySql',
                                    value: 'mysql',
                                },
                                {
                                    title: 'NariaDB',
                                    value: 'mariadb',
                                },
                                {
                                    title: 'Postgres',
                                    value: 'postgres',
                                },
                                {
                                    title: 'Cockroachdb',
                                    value: 'cockroachdb',
                                },
                                {
                                    title: 'SqLite',
                                    value: 'sqlite',
                                },
                                {
                                    title: 'MsSql',
                                    value: 'mssql',
                                },
                                {
                                    title: 'Oracle',
                                    value: 'oracle',
                                },
                                {
                                    title: 'MongoDb',
                                    value: 'mongodb',
                                },
                                {
                                    title: 'Cordova',
                                    value: 'cordova',
                                },
                                {
                                    title: 'React Native',
                                    value: 'react-native',
                                },
                                {
                                    title: 'Expo',
                                    value: 'expo',
                                },
                                {
                                    title: 'NativeScript',
                                    value: 'nativescript',
                                },
                            ],
                        })];
                    case 1:
                        dbs = (_a.sent()).dbs;
                        return [2 /*return*/, dbs];
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