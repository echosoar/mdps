"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const reg_1 = require("./reg");
class Mder {
    constructor() {
        this.innerSplit = ':mder:&:split:';
        this.result = [];
        this.notMatch = false;
    }
    parse(mdContent) {
        const allLine = mdContent.split(/\n/);
        let execInfo = null;
        while (allLine.length) {
            const currentLine = allLine.shift();
            execInfo = reg_1.CodeReg.exec(currentLine);
            if (execInfo) {
                if (!this.notMatch) {
                    this.notMatch = true;
                    this.insertToResult({ type: 'code', lang: execInfo[1], childs: [] });
                }
                else {
                    this.notMatch = false;
                }
                continue;
            }
            if (this.notMatch) {
                this.insertNotMatch(currentLine);
                continue;
            }
            if (/^\s*$/.test(currentLine)) {
                this.insertToResult({ type: 'empty' });
                continue;
            }
            if (reg_1.HrReg.test(currentLine)) {
                this.insertToResult({ type: 'hr' });
                continue;
            }
            execInfo = reg_1.HeadReg.exec(currentLine);
            if (execInfo) {
                this.insertToResult({ type: 'head', level: execInfo[1].length, value: execInfo[2] });
                continue;
            }
            execInfo = reg_1.TaskReg.exec(currentLine);
            if (execInfo) {
                this.formatTask(execInfo);
                continue;
            }
            execInfo = reg_1.UlReg.exec(currentLine);
            if (execInfo) {
                this.formatList('ul', execInfo);
                continue;
            }
            execInfo = reg_1.OlReg.exec(currentLine);
            if (execInfo) {
                this.formatList('ol', execInfo);
                continue;
            }
            execInfo = reg_1.BlockquoteReg.exec(currentLine);
            if (execInfo) {
                this.insertToResult({
                    type: 'blockquote',
                    level: execInfo[1].length,
                    childs: [{
                            type: 'item',
                            childs: [this.formatLine(execInfo[2])],
                        }],
                });
                continue;
            }
            this.insertToResult(this.formatLine(currentLine));
        }
    }
    getResult() {
        return this.result;
    }
    formatLine(line) {
        const tmp = [];
        const newLine = this.formatImgAndLink(line, tmp);
        return { type: 'line', childs: this.splitGroupLine(newLine, tmp) };
    }
    splitGroupLine(line, tmp, onlyText) {
        const result = [];
        line.split(this.innerSplit).forEach((value) => {
            if (!value) {
                return;
            }
            if (/^\d+$/.test(value)) {
                result.push(tmp[value]);
            }
            else if (onlyText) {
                result.push({ type: 'text', value });
            }
            else {
                result.push(...this.formatBoldAndItalic(value));
            }
        });
        return result;
    }
    formatList(type, listInfo) {
        this.insertToResult({
            type,
            level: listInfo[1].length,
            childs: [{
                    type: 'item',
                    childs: [this.formatLine(listInfo[2])],
                }],
        });
    }
    formatTask(taskInfo) {
        this.insertToResult({
            type: 'task',
            level: taskInfo[1].length,
            childs: [{
                    type: 'item',
                    complete: !!(taskInfo[2] || '').replace(/\s/g, ''),
                    childs: [this.formatLine(taskInfo[3])],
                }],
        });
    }
    formatImgAndLink(line, contentList) {
        let newLine = line;
        while (reg_1.ImgAndLinkReg.test(newLine)) {
            newLine = newLine.replace(reg_1.ImgAndLinkReg, (match, imgTitle, imgSrc, linkTitle, linkHref) => {
                if (imgTitle || imgSrc) {
                    contentList.push({ type: 'img', alt: imgTitle, src: imgSrc });
                }
                else if (linkTitle || linkHref) {
                    contentList.push({ type: 'link', childs: this.splitGroupLine(linkTitle, contentList), href: linkHref });
                }
                else {
                    return match;
                }
                return this.innerSplit + (contentList.length - 1) + this.innerSplit;
            });
        }
        return newLine;
    }
    formatBoldAndItalic(line, tmp) {
        tmp = tmp || [];
        let newLine = line;
        const regList = [
            { type: 'bold', reg: reg_1.BoldReg, replace: (boldContent) => (boldContent && this.formatBoldAndItalic(boldContent, tmp)) },
            { type: 'italic', reg: reg_1.ItalicReg, replace: (itaOne, itaTwo) => (this.formatBoldAndItalic(itaOne || itaTwo, tmp)) },
        ];
        regList.forEach((regInfo) => {
            while (regInfo.reg.test(newLine)) {
                newLine = newLine.replace(regInfo.reg, (_, ...args) => {
                    const childs = regInfo.replace(...args);
                    if (!childs) {
                        return '';
                    }
                    tmp.push({ type: regInfo.type, childs });
                    return this.innerSplit + (tmp.length - 1) + this.innerSplit;
                });
            }
        });
        return this.splitGroupLine(newLine, tmp, true);
    }
    insertToResult(item, result) {
        result = result || this.result;
        const pre = result && result[result.length - 1];
        if (pre && pre.type === 'head') {
            if (item.type === 'head' && pre.level >= item.level) {
                result.push(item);
            }
            else {
                if (!pre.childs) {
                    pre.childs = [];
                }
                this.insertToResult(item, pre.childs);
            }
            return;
        }
        if (pre && pre.type === 'code' && this.notMatch) {
            this.insertToResult(item, pre.childs);
            return;
        }
        if (item.type === 'empty' && result.length === 0) {
            return;
        }
        if (item.level != null) {
            if (pre) {
                if (pre.type === item.type) {
                    if (pre.level === item.level) {
                        this.insertToResult(item.childs[0], pre.childs);
                        return;
                    }
                }
                if (pre.level != null) {
                    if (pre.level < item.level) {
                        const preLastChild = pre.childs[pre.childs.length - 1];
                        if (!preLastChild.childs) {
                            preLastChild.childs = [];
                        }
                        this.insertToResult(item, preLastChild.childs);
                        return;
                    }
                }
            }
        }
        result.push(item);
    }
    insertNotMatch(currentLine) {
        this.insertToResult({ type: 'line', childs: [{ type: 'text', value: currentLine }] }, this.result);
    }
}
exports.default = Mder;
