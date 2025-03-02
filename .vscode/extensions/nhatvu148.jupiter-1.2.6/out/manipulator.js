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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
const fs = require("fs");
const Papa = require("papaparse");
const { promisify } = require("util");
const appendFile = promisify(fs.appendFile);
let libKey = [];
let psjUtilKeys = [];
let psjGuiKeys = [];
let funcs = [];
const readKeywords = () => __awaiter(void 0, void 0, void 0, function* () {
    if (fs.existsSync(`${__dirname}/data/Keywords.dat`)) {
        const files = yield fs.readFileSync(`${__dirname}/data/Keywords.dat`, "utf8");
        Papa.parse(files, {
            complete: function (results) {
                libKey = results.data[6];
                psjUtilKeys = results.data[9];
                psjGuiKeys = results.data[12];
                fs.writeFile(`${__dirname}/data/libKey.txt`, JSON.stringify(libKey), function (err) {
                    if (err)
                        return console.log(err);
                });
                fs.writeFile(`${__dirname}/data/psjUtilKeys.txt`, JSON.stringify(psjUtilKeys), function (err) {
                    if (err)
                        return console.log(err);
                });
                fs.writeFile(`${__dirname}/data/psjGuiKeys.txt`, JSON.stringify(psjGuiKeys), function (err) {
                    if (err)
                        return console.log(err);
                });
            },
        });
    }
    else {
        console.log(__dirname);
    }
});
// READ PSJ COMMANDS
const readPsjCommands = () => __awaiter(void 0, void 0, void 0, function* () {
    if (fs.existsSync(`${__dirname}/data/PSJCommandCalltips.dat`)) {
        const files = yield fs.readFileSync(`${__dirname}/data/PSJCommandCalltips.dat`, "utf8");
        Papa.parse(files, {
            complete: function (results) {
                funcs = results.data
                    .filter((a) => a[0].includes("Function:"))
                    .map((a) => a[0].substring(10));
                const arr = funcs
                    .map((f) => f.split("."))
                    .reduce((group, itm, idx, arr) => {
                    group[itm[0]] = group[itm[0]]
                        ? [...group[itm[0]], itm.slice(1)]
                        : [itm.slice(1)];
                    return group;
                }, {});
                const group1 = funcs
                    .map((f) => f.split("."))
                    .reduce((group, itm, idx, arr) => {
                    group[itm[0]] = group[itm[0]]
                        ? [...group[itm[0]], itm[1]]
                        : [itm[1]];
                    return group;
                }, {});
                Object.keys(group1).forEach((o) => {
                    group1[o] = [...new Set(group1[o])];
                });
                const group2 = funcs
                    .map((f) => f.split("."))
                    .reduce((group, itm, idx, arr) => {
                    group[itm[1]] = group[itm[1]]
                        ? [...group[itm[1]], itm[2]]
                        : [itm[2]];
                    return group;
                }, {});
                Object.keys(group2).forEach((o) => {
                    group2[o] = [...new Set(group2[o])];
                });
                const group3 = funcs
                    .map((f) => f.split("."))
                    .reduce((group, itm, idx, arr) => {
                    group[itm[2]] = group[itm[2]]
                        ? [...group[itm[2]], itm[3]]
                        : [itm[3]];
                    return group;
                }, {});
                Object.keys(group3).forEach((o) => {
                    group3[o] = [...new Set(group3[o])];
                });
                const group4 = funcs
                    .map((f) => f.split("."))
                    .reduce((group, itm, idx, arr) => {
                    group[itm[3]] = group[itm[3]]
                        ? [...group[itm[3]], itm[4]]
                        : [itm[4]];
                    return group;
                }, {});
                Object.keys(group4).forEach((o) => {
                    group4[o] = [...new Set(group4[o])];
                });
                // fs.writeFile(
                //   `${__dirname}/data/root4.txt`,
                //   JSON.stringify(Object.keys(group4)),
                //   function (err: any) {
                //     if (err) return console.log(err);
                //     console.log("Hello World > root4.txt");
                //   }
                // );
                fs.writeFile(`${__dirname}/data/map45.txt`, JSON.stringify(group4), function (err) {
                    if (err)
                        return console.log(err);
                    console.log("Hello World > map45.txt");
                });
                console.log(Object.keys(group1));
            },
        });
    }
    else {
        console.log(__dirname);
    }
});
// readPsjCommands();
const stringManipulate = (val, a, i) => {
    if (val !== null) {
        if (val[0].startsWith('"')) {
            const content = val[0].match(/(?<=\").*(?=\")/);
            if (content !== null) {
                const mod = a.replace(`"${content[0]}"`, `"\${${i[0]}:${content[0]}}"`);
                i[0]++;
                return mod;
            }
        }
        else if (val[0].startsWith("[")) {
            const content = val[0].match(/(?<=\[).*(?=\])/);
            if (content !== null) {
                if (content[0] !== "") {
                    const _content = content[0]
                        .split(",")
                        .map((c) => {
                        const _c = `\${${i[0]}:${c}}`;
                        i[0]++;
                        return _c;
                    })
                        .join(",");
                    const mod = a.replace(`[${content[0]}]`, `[${_content}]`);
                    return mod;
                }
                else {
                    const mod = a.replace(`[${content[0]}]`, `[\${${i[0]}:${content[0]}}]`);
                    i[0]++;
                    return mod;
                }
            }
        }
        else {
            const mod = a.replace(val[0], `\${${i[0]}:${val[0]}}`);
            i[0]++;
            return mod;
        }
    }
    else {
        return a;
    }
};
// READ PSJ SNIPPETS
const readPSJSnippets = () => __awaiter(void 0, void 0, void 0, function* () {
    if (fs.existsSync(`${__dirname}/data/NewPSJCommands.py`)) {
        const files = yield fs.readFileSync(`${__dirname}/data/NewPSJCommands.py`, "utf8");
        Papa.parse(files, {
            complete: function (results) {
                const res = results.data;
                const snippets = res.reduce((obj, cur, idx) => {
                    const fnName = cur[0].split("(")[0];
                    if (obj[fnName]) {
                        return obj;
                    }
                    else {
                        let i = [1];
                        const modCur = cur
                            .join()
                            .split("=")
                            .map((a) => a.trim())
                            .map((a, index, arr) => {
                            if (index === 0) {
                                return a;
                            }
                            else if (index !== arr.length - 1) {
                                const val = a.match(/.*(?=\,)/);
                                return stringManipulate(val, a, i);
                            }
                            else {
                                const val = a.match(/.*(?=\))/);
                                return stringManipulate(val, a, i);
                            }
                        });
                        return Object.assign(Object.assign({}, obj), { [fnName]: {
                                prefix: `${fnName}`,
                                body: modCur.join("="),
                                description: `Code snippet for ${fnName}`,
                            } });
                    }
                }, {});
                console.log(snippets);
                fs.writeFile(`${__dirname}/data/psjSnippets.txt`, JSON.stringify(snippets), function (err) {
                    if (err)
                        return console.log(err);
                });
            },
        });
    }
    else {
        console.log(__dirname);
    }
});
// readPSJSnippets();
// READ PSJ CALL TIPS
const readPSJCallTips = () => __awaiter(void 0, void 0, void 0, function* () {
    if (fs.existsSync(`${__dirname}/data/PSJCommandCalltips.txt`)) {
        const files = yield fs.readFileSync(`${__dirname}/data/PSJCommandCalltips.txt`, "utf8");
        Papa.parse(files, {
            delimiter: ":)))",
            complete: function (results) {
                const res = results.data;
                // const obj = {
                //   "FileMenu.AddJTDB":
                //     "Name: FileMenu.AddJTDB\nDesc: add jtdb into model\nJVer: 5.0",
                // };
                const obj = res.reduce((arr, cur, idx, bigArr) => {
                    if (idx === bigArr.length - 1) {
                        return arr[1];
                    }
                    if (cur[0].startsWith("Name:")) {
                        const match = cur[0].match(/(?<=\.)[A-Za-z_]*$/);
                        const mod = cur[0].match(/^.*(?=:)/);
                        if (match !== null && mod !== null && match[0] !== "") {
                            arr[0] = cur[0].replace(mod[0] + ": ", "");
                            const fnName = match[0];
                            const _newCur0 = cur[0].replace(mod[0] + ":", `*${mod[0]}:*`);
                            arr[1][arr[0]] = {
                                prefix: fnName,
                                text: _newCur0 + "  \n",
                            };
                        }
                        return arr;
                    }
                    else if (cur[0].startsWith("-----")) {
                        return arr;
                    }
                    else {
                        const mod = cur[0].match(/^.*(?=:)/);
                        let _newCur0 = cur[0];
                        if (mod !== null) {
                            _newCur0 = cur[0].replace(mod[0] + ":", `*${mod[0]}:*`);
                        }
                        arr[1][arr[0]].text = arr[1][arr[0]].text.concat(_newCur0 + "  \n ");
                        return arr;
                    }
                }, ["", {}]);
                console.log(obj);
                fs.writeFile(`${__dirname}/data/psjCallTips.txt`, JSON.stringify(obj), function (err) {
                    if (err)
                        return console.log(err);
                });
            },
        });
    }
    else {
        console.log(__dirname);
    }
});
// readPSJCallTips();
// readKeywords();
// function* getNames() {
//   console.log("2");
//   yield "John";
//   console.log("4");
//   let myVal = yield "Stephanie";
//   console.log(`6. Passed in value: ${myVal}`);
// }
// const nameGen = getNames();
// console.log("1");
// console.log(`3. ${nameGen.next().value}`);
// console.log(`5. ${nameGen.next().value}`);
// console.log(`7. Done?${nameGen.next(999).done}`);
const psjUtilityCalltips = () => __awaiter(void 0, void 0, void 0, function* () {
    if (fs.existsSync(`${__dirname}/data/PSJUtilityCalltips.dat`)) {
        const files = yield fs.readFileSync(`${__dirname}/data/PSJUtilityCalltips.dat`, "utf8");
        Papa.parse(files, {
            delimiter: ":)))",
            complete: function (results) {
                const res = results.data;
                const obj = res.reduce((arr, cur, idx, bigArr) => {
                    if (idx === bigArr.length - 1) {
                        return arr[1];
                    }
                    if (cur[0].startsWith("Function:")) {
                        const match = cur[0].match(/(?<=\.)[A-Za-z_1-9]*$/);
                        const mod = cur[0].match(/^.*(?=:)/);
                        if (match !== null && mod !== null && match[0] !== "") {
                            arr[0] = cur[0].replace(mod[0] + ": ", "");
                            const fnName = match[0];
                            const _newCur0 = cur[0].replace(mod[0] + ":", `*${mod[0]}:*`);
                            arr[1][arr[0]] = {
                                prefix: fnName,
                                text: _newCur0 + "  \n",
                            };
                        }
                        return arr;
                    }
                    else if (cur[0].startsWith("-----")) {
                        return arr;
                    }
                    else {
                        const mod = cur[0].match(/^.*(?=:)/);
                        let _newCur0 = cur[0];
                        if (mod !== null) {
                            _newCur0 = cur[0].replace(mod[0] + ":", `*${mod[0]}:*`);
                        }
                        arr[1][arr[0]].text = arr[1][arr[0]].text.concat(_newCur0 + "  \n ");
                        return arr;
                    }
                }, ["", {}]);
                console.log(obj);
                fs.writeFile(`${__dirname}/data/psjUtilityCallTips.txt`, JSON.stringify(obj), function (err) {
                    if (err)
                        return console.log(err);
                });
            },
        });
    }
    else {
        console.log(__dirname);
    }
});
// psjUtilityCalltips();
const psjUtilityCalltipsPython = () => __awaiter(void 0, void 0, void 0, function* () {
    if (fs.existsSync(`${__dirname}/data/PSJUtilityCalltips.dat`)) {
        const files = yield fs.readFileSync(`${__dirname}/data/PSJUtilityCalltips.dat`, "utf8");
        Papa.parse(files, {
            delimiter: ":)))",
            complete: function (results) {
                const res = results.data;
                const obj = res.reduce((arr, cur, idx, bigArr) => {
                    if (idx === bigArr.length - 1) {
                        return arr[1];
                    }
                    if (cur[0].startsWith("Function:")) {
                        const match = cur[0].match(/(?<=\.)[A-Za-z_1-9]*$/);
                        const mod = cur[0].match(/^.*(?=:)/);
                        if (match !== null && mod !== null && match[0] !== "") {
                            arr[0] = cur[0].replace(mod[0] + ": ", "");
                            const fnName = match[0];
                            const _newCur0 = cur[0].replace(mod[0] + ":", `*${mod[0]}:*`);
                            arr[2] = [];
                            arr[1][arr[0]] = {
                                prefix: fnName,
                                text: _newCur0 + "  \n",
                                params: arr[2],
                            };
                        }
                        return arr;
                    }
                    else if (cur[0].startsWith("-----")) {
                        return arr;
                    }
                    else {
                        const mod = cur[0].match(/^.*(?=:)/);
                        let _newCur0 = cur[0];
                        if (mod !== null) {
                            _newCur0 = cur[0].replace(mod[0] + ":", `*${mod[0]}:*`);
                            if (cur[0].startsWith("Input1: None")) {
                                arr[2] = [];
                            }
                            else if (mod[0].startsWith("Input")) {
                                if (cur[0].includes("string")) {
                                    arr[2].push(mod[0] + "_str");
                                }
                                else {
                                    arr[2].push(mod[0]);
                                }
                            }
                        }
                        arr[1][arr[0]].text = arr[1][arr[0]].text.concat(_newCur0 + "  \n ");
                        arr[1][arr[0]].params = arr[2];
                        return arr;
                    }
                }, ["", {}, []]);
                console.log(obj);
                (function () {
                    return __awaiter(this, void 0, void 0, function* () {
                        for (let i = 0; i < Object.keys(obj).length; i++) {
                            const a = Object.keys(obj)[i];
                            const mdString = yield readMdString(`${obj[a].prefix}`);
                            yield appendFile(`${__dirname}/data/Jupiter.py`, `def ${obj[a].prefix}(${obj[a].params}):\n    r"""\n    ${mdString === null || mdString === void 0 ? void 0 : mdString.map((mds) => mds[0]).join("\n    ")}\n    """\n    message = "${a}(${obj[a].params.map((b) => b.includes("_str") ? "'{}'" : "{}")})".format(${obj[a].params})\n    return JPT_RUN_LINE(message)\n\n`, function (err) {
                                if (err)
                                    throw err;
                            });
                        }
                    });
                })();
                // fs.writeFile(
                //   `${__dirname}/data/psjUtilityCallTips.txt`,
                //   JSON.stringify(obj),
                //   function (err: any) {
                //     if (err) return console.log(err);
                //   },
                // );
            },
        });
    }
    else {
        console.log(__dirname);
    }
});
// psjUtilityCalltipsPython();
const getParams = (str) => {
    const fnName = str.split("(")[0];
    const inbracket = str.match(/(?<=\().*(?=\))/);
    let params = [];
    if (inbracket) {
        params = inbracket[0].split(",").reduce((ib, cur, idx, arr) => {
            if (cur.includes("=")) {
                ib[0]++;
                ib[1].push(cur);
                ib[2] = true;
            }
            else if (cur === "") {
                ib[1].push(cur);
            }
            else if (ib[2] === true && ib[1][ib[0]]) {
                ib[1][ib[0]] = ib[1][ib[0]].concat("," + cur);
            }
            else {
                ib[0]++;
                ib[1].push(cur);
            }
            if (idx === arr.length - 1) {
                return ib[1];
            }
            else {
                return ib;
            }
        }, [-1, [], false]);
    }
    return [fnName, params];
};
const readMdString = (fullFnName) => __awaiter(void 0, void 0, void 0, function* () {
    let filename = "";
    if (fullFnName.includes(".")) {
        const folderName = fullFnName
            .split(".")[0]
            .split(/(?=[A-Z][a-z])/)
            .map((s) => s.toLowerCase())
            .join("-");
        filename = `${__dirname}/data/psj-command/${folderName}/${fullFnName}.md`;
    }
    else {
        filename = `${__dirname}/data/psj-utility/PSJ-Utility_${fullFnName}.md`;
    }
    if (fs.existsSync(filename)) {
        const files = yield fs.readFileSync(filename, "utf8");
        let result = [];
        Papa.parse(files, {
            complete: function (results) {
                const res = results.data;
                const descIdx = res.reduce((index, cur, idx) => {
                    if (cur[0].includes("## Description")) {
                        return idx;
                    }
                    return index;
                }, -1);
                result = res.slice(descIdx).map((str) => {
                    if (str.length > 1) {
                        return [str.join(",")];
                    }
                    return str;
                });
            },
        });
        return result;
    }
});
// (async function () {
//   const res = await readMdString(
//     "RemoveEntitiesByID",
//   );
//   console.log(res);
// })();
const readPSJCommandsPython = () => __awaiter(void 0, void 0, void 0, function* () {
    if (fs.existsSync(`${__dirname}/data/NewPSJCommands.py`)) {
        const files = yield fs.readFileSync(`${__dirname}/data/NewPSJCommands.py`, "utf8");
        Papa.parse(files, {
            complete: function (results) {
                const res = results.data;
                const res2 = res
                    .map((a) => {
                    return a.join(",").split(".");
                })
                    .reduce((arr, cur, idx) => {
                    const preArr = [];
                    const postArr = [];
                    for (let i = 0; i < cur.length; i++) {
                        if (cur[i].includes("(")) {
                            postArr.push(cur.slice(i).join("."));
                            break;
                        }
                        else {
                            preArr.push(cur[i]);
                        }
                    }
                    arr.push([...preArr, ...postArr]);
                    return arr;
                }, []);
                const res3 = res2.reduce((r2, cur) => {
                    r2[cur[0]] = r2[cur[0]]
                        ? r2[cur[0]].concat([cur.slice(1)])
                        : [cur.slice(1)];
                    return r2;
                }, {});
                Object.keys(res3).forEach((el3, idx) => {
                    res3[el3] = res3[el3].reduce((r3, cur) => {
                        if (cur.length === 1 && cur[0].includes("(")) {
                            r3["own"] = r3["own"] ? r3["own"].concat([cur[0]]) : [cur[0]];
                        }
                        else {
                            r3[cur[0]] = r3[cur[0]]
                                ? r3[cur[0]].concat([cur.slice(1)])
                                : [cur.slice(1)];
                        }
                        return r3;
                    }, {});
                });
                Object.keys(res3).forEach((el3, idx) => {
                    Object.keys(res3[el3]).forEach((el4, i) => {
                        if (el4 !== "own") {
                            res3[el3][el4] = res3[el3][el4].reduce((r3, cur) => {
                                if (cur.length === 1 && cur[0].includes("(")) {
                                    r3["own"] = r3["own"] ? r3["own"].concat([cur[0]]) : [cur[0]];
                                }
                                else {
                                    r3[cur[0]] = r3[cur[0]]
                                        ? r3[cur[0]].concat([cur.slice(1)])
                                        : [cur.slice(1)];
                                }
                                return r3;
                            }, {});
                        }
                    });
                });
                Object.keys(res3).forEach((el3, idx) => {
                    Object.keys(res3[el3]).forEach((el4, i) => {
                        if (el4 !== "own") {
                            Object.keys(res3[el3][el4]).forEach((el5) => {
                                if (el5 !== "own") {
                                    res3[el3][el4][el5] = res3[el3][el4][el5].reduce((r3, cur) => {
                                        if (cur.length === 1 && cur[0].includes("(")) {
                                            r3["own"] = r3["own"]
                                                ? r3["own"].concat([cur[0]])
                                                : [cur[0]];
                                        }
                                        else {
                                            r3[cur[0]] = r3[cur[0]]
                                                ? r3[cur[0]].concat([cur.slice(1)])
                                                : [cur.slice(1)];
                                        }
                                        return r3;
                                    }, {});
                                }
                            });
                        }
                    });
                });
                // Create Utility.py
                (function () {
                    return __awaiter(this, void 0, void 0, function* () {
                        for (let i3 = 0; i3 < Object.keys(res3).length; i3++) {
                            const el3 = Object.keys(res3)[i3];
                            for (let i4 = 0; i4 < Object.keys(res3[el3]).length; i4++) {
                                const el4 = Object.keys(res3[el3])[i4];
                                if (el4 !== "own") {
                                    for (let i5 = 0; i5 < Object.keys(res3[el3][el4]).length; i5++) {
                                        const el5 = Object.keys(res3[el3][el4])[i5];
                                        if (el5 !== "own") {
                                            for (let i6 = 0; i6 < Object.keys(res3[el3][el4][el5]).length; i6++) {
                                                const el6 = Object.keys(res3[el3][el4][el5])[i6];
                                                if (el6 !== "own") {
                                                    yield appendFile(`${__dirname}/data/Utility.py`, `class ${el5}_${el6}:\n`);
                                                    for (let i7 = 0; i7 < res3[el3][el4][el5][el6].length; i7++) {
                                                        const [fnName, params] = getParams(res3[el3][el4][el5][el6][i7][0]);
                                                        const mdString = yield readMdString(`${el3}.${el4}.${el5}.${el6}.${fnName}`);
                                                        yield appendFile(`${__dirname}/data/Utility.py`, `    def ${fnName}(self, ${params}):\n        r"""\n        ${mdString === null || mdString === void 0 ? void 0 : mdString.map((mds) => mds[0]).join("\n        ")}\n        """\n        message = "${el3}.${el4}.${el5}.${el6}.${fnName}(${params.map((p) => {
                                                            const varName = p.split("=")[0];
                                                            return varName.includes("str") ? "'{}'" : "{}";
                                                        })})".format(${params.length === 1 && params[0] === ""
                                                            ? "''"
                                                            : params.map((p) => p.split("=")[0])})\n        return JPT_RUN_LINE(message)\n\n`);
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    for (let i5 = 0; i5 < Object.keys(res3[el3][el4]).length; i5++) {
                                        const el5 = Object.keys(res3[el3][el4])[i5];
                                        if (el5 !== "own") {
                                            yield appendFile(`${__dirname}/data/Utility.py`, `class ${el4}_${el5}:\n`);
                                            for (let i6 = 0; i6 < Object.keys(res3[el3][el4][el5]).length; i6++) {
                                                const el6 = Object.keys(res3[el3][el4][el5])[i6];
                                                if (el6 !== "own") {
                                                    yield appendFile(`${__dirname}/data/Utility.py`, `    ${el6} = ${el5}_${el6}()\n\n`);
                                                }
                                                if (el6 === "own") {
                                                    for (let i7 = 0; i7 < res3[el3][el4][el5][el6].length; i7++) {
                                                        const [fnName, params] = getParams(res3[el3][el4][el5][el6][i7]);
                                                        const mdString = yield readMdString(`${el3}.${el4}.${el5}.${fnName}`);
                                                        yield appendFile(`${__dirname}/data/Utility.py`, `    def ${fnName}(self, ${params}):\n        r"""\n        ${mdString === null || mdString === void 0 ? void 0 : mdString.map((mds) => mds[0]).join("\n        ")}\n        """\n        message = "${el3}.${el4}.${el5}.${fnName}(${params.map((p) => {
                                                            const varName = p.split("=")[0];
                                                            return varName.includes("str") ? "'{}'" : "{}";
                                                        })})".format(${params.length === 1 && params[0] === ""
                                                            ? "''"
                                                            : params.map((p) => p.split("=")[0])})\n        return JPT_RUN_LINE(message)\n\n`);
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            for (let i4 = 0; i4 < Object.keys(res3[el3]).length; i4++) {
                                const el4 = Object.keys(res3[el3])[i4];
                                if (el4 !== "own") {
                                    yield appendFile(`${__dirname}/data/Utility.py`, `class ${el3}_${el4}:\n`);
                                    for (let i5 = 0; i5 < Object.keys(res3[el3][el4]).length; i5++) {
                                        const el5 = Object.keys(res3[el3][el4])[i5];
                                        if (el5 !== "own") {
                                            yield appendFile(`${__dirname}/data/Utility.py`, `    ${el5} = ${el4}_${el5}()\n\n`);
                                        }
                                        if (el5 === "own") {
                                            for (let i6 = 0; i6 < res3[el3][el4][el5].length; i6++) {
                                                const [fnName, params] = getParams(res3[el3][el4][el5][i6]);
                                                const mdString = yield readMdString(`${el3}.${el4}.${fnName}`);
                                                yield appendFile(`${__dirname}/data/Utility.py`, `    def ${fnName}(self, ${params}):\n        r"""\n        ${mdString === null || mdString === void 0 ? void 0 : mdString.map((mds) => mds[0]).join("\n        ")}\n        """\n        message = "${el3}.${el4}.${fnName}(${params.map((p) => {
                                                    const varName = p.split("=")[0];
                                                    return varName.includes("str") ? "'{}'" : "{}";
                                                })})".format(${params.length === 1 && params[0] === ""
                                                    ? "''"
                                                    : params.map((p) => p.split("=")[0])})\n        return JPT_RUN_LINE(message)\n\n`);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        for (let i3 = 0; i3 < Object.keys(res3).length; i3++) {
                            const el3 = Object.keys(res3)[i3];
                            yield appendFile(`${__dirname}/data/Utility.py`, `class ${el3}:\n`);
                            for (let i4 = 0; i4 < Object.keys(res3[el3]).length; i4++) {
                                const el4 = Object.keys(res3[el3])[i4];
                                if (el4 !== "own") {
                                    yield appendFile(`${__dirname}/data/Utility.py`, `    ${el4} = ${el3}_${el4}()\n\n`);
                                }
                                if (el4 === "own") {
                                    for (let i5 = 0; i5 < res3[el3][el4].length; i5++) {
                                        const [fnName, params] = getParams(res3[el3][el4][i5]);
                                        const mdString = yield readMdString(`${el3}.${fnName}`);
                                        yield appendFile(`${__dirname}/data/Utility.py`, `    def ${fnName}(${params}):\n        r"""\n        ${mdString === null || mdString === void 0 ? void 0 : mdString.map((mds) => mds[0]).join("\n        ")}\n        """\n        message = "${el3}.${fnName}(${params.map((p) => {
                                            const varName = p.split("=")[0];
                                            return varName.includes("str") ? "'{}'" : "{}";
                                        })})".format(${params.length === 1 && params[0] === ""
                                            ? "''"
                                            : params.map((p) => p.split("=")[0])})\n        return JPT_RUN_LINE(message)\n\n`);
                                    }
                                }
                            }
                        }
                    });
                })();
                // res2.forEach((strArr: string[]) => {
                //   for (let i = strArr.length - 1; i > 0; i--) {
                //     if (strArr[i].includes("(")) {
                //       const fnName = strArr[i].split("(")[0];
                //       const inbracket = strArr[i].match(/(?<=\().*(?=\))/);
                //       let params: string[] = [];
                //       if (inbracket) {
                //         params = inbracket[0].split(",").reduce(
                //           (ib: any[], cur: string, idx: number, arr: any[]) => {
                //             if (cur.includes("=")) {
                //               ib[0]++;
                //               ib[1].push(cur);
                //             } else if (cur === "") {
                //               ib[1].push(cur);
                //             } else {
                //               ib[1][ib[0]] = ib[1][ib[0]].concat("," + cur);
                //             }
                //             if (idx === arr.length - 1) {
                //               return ib[1];
                //             } else {
                //               return ib;
                //             }
                //           },
                //           [-1, []],
                //         );
                //       }
                //       // console.log(params);
                //       fs.appendFile(
                //         `${__dirname}/data/Utility.py`,
                //         `class ${strArr[i - 1]}:\n    def ${fnName}(${
                //           i > 1 ? "self, " : ""
                //         }${params.map(
                //           (p: string) => p.split("=")[0],
                //         )}):\n        message = "${strArr
                //           .slice(0, i)
                //           .join(".")}.${fnName}(${params.map((p: string) => {
                //           const varName = p.split("=")[0];
                //           return varName.includes("str") ? "'{}'" : "{}";
                //         })})".format(${params.map(
                //           (p: string) => p.split("=")[0],
                //         )})\n        return JPT_RUN_LINE(message)\n\n`,
                //         function (err: any) {
                //           if (err) throw err;
                //         },
                //       );
                //     } else {
                //       fs.appendFile(
                //         `${__dirname}/data/Utility.py`,
                //         `class ${strArr[i - 1]}:\n    ${strArr[i]} = ${
                //           strArr[i]
                //         }()\n\n`,
                //         function (err: any) {
                //           if (err) throw err;
                //         },
                //       );
                //     }
                //   }
                // });
                // console.log(res3);
                // fs.writeFile(
                //   `${__dirname}/data/res3.json`,
                //   JSON.stringify(res3),
                //   function (err: any) {
                //     if (err) return console.log(err);
                //   },
                // );
                // (async function () {
                //   for (let i = 0; i < Object.keys(res3).length; i++) {
                //     await appendFile(
                //       `${__dirname}/data/MainClassNames.txt`,
                //       `${Object.keys(res3)[i]}, `,
                //     );
                //   }
                // })();
            },
        });
    }
    else {
        console.log(__dirname);
    }
});
// readPSJCommandsPython();
// Read EntityType/UnitType
const readEntityType = () => __awaiter(void 0, void 0, void 0, function* () {
    if (fs.existsSync(`${__dirname}/data/AssociateType.txt`)) {
        const files = yield fs.readFileSync(`${__dirname}/data/AssociateType.txt`, "utf8");
        Papa.parse(files, {
            complete: function (results) {
                const res = results.data;
                const res2 = res.map((a) => {
                    const [a1, a2] = a[0].split(":");
                    return a2.split(".")[2] + " = " + a1;
                });
                console.log(res2);
                res2.forEach((element) => {
                    fs.appendFile(`${__dirname}/data/AssociateType2.txt`, element + "\n", function (err) {
                        if (err)
                            throw err;
                    });
                });
            },
        });
    }
    else {
        console.log(__dirname);
    }
});
// readEntityType();
//// READ PSJ FOLDER:
const readPSJFolder = () => __awaiter(void 0, void 0, void 0, function* () {
    var e_1, _a;
    const dir = yield fs.promises.opendir(`${__dirname}/data/PSJCommand_TestCases`);
    try {
        for (var dir_1 = __asyncValues(dir), dir_1_1; dir_1_1 = yield dir_1.next(), !dir_1_1.done;) {
            const dirent = dir_1_1.value;
            console.log(dirent.name);
            const files = yield fs.readFileSync(`${__dirname}/data/PSJCommand_TestCases/${dirent.name}`, "utf8");
            Papa.parse(files, {
                complete: function (results) {
                    const res = results.data;
                    const fn = res.filter((r) => r[0].includes("("));
                    console.log(fn[0].join(","));
                    (function () {
                        return __awaiter(this, void 0, void 0, function* () {
                            yield appendFile(`${__dirname}/data/NewPSJCommands.py`, `${fn[0].join(",")}\n`);
                        });
                    })();
                },
            });
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (dir_1_1 && !dir_1_1.done && (_a = dir_1.return)) yield _a.call(dir_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
});
// readPSJFolder();
//# sourceMappingURL=manipulator.js.map