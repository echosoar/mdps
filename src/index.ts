import {
  BlockquoteReg,
  BoldReg,
  CodeReg,
  HeadReg,
  HrReg,
  ImgAndLinkReg,
  ItalicReg,
  OlReg,
  TaskReg,
  UlReg,
  DelReg,
  inlineCodeReg,
  SubReg,
  SupReg,
  HighLightReg,
} from './reg';
export default class Mdps {
  private innerSplit: string = ':mdps:&:split:';
  private result: any = [];
  private notMatch: boolean = false;
  public parse(mdContent: string) {
    const allLine = mdContent.split(/\n/);
    let execInfo = null;
    while (allLine.length) {
      const currentLine = allLine.shift();
      // code
      execInfo = CodeReg.exec(currentLine);
      if (execInfo) {
        if (!this.notMatch) {
          this.notMatch = true;
          this.insertToResult({ type: 'code', lang: execInfo[1], childs: []});
        } else {
          this.notMatch = false;
        }
        continue;
      }

      if (this.notMatch) {
        this.insertNotMatch(currentLine);
        continue;
      }

      // empty line
      if (/^\s*$/.test(currentLine)) {
        this.insertToResult({ type: 'empty' });
        continue;
      }

      // hr
      if (HrReg.test(currentLine)) {
        this.insertToResult({ type: 'hr' });
        continue;
      }

      // head1 to head6
      execInfo = HeadReg.exec(currentLine);
      if (execInfo) {
        this.insertToResult({ type: 'head', level: execInfo[1].length, value: execInfo[2] });
        continue;
      }

      // task
      execInfo = TaskReg.exec(currentLine);
      if (execInfo) {
        this.formatTask(execInfo);
        continue;
      }

      // ul
      execInfo = UlReg.exec(currentLine);
      if (execInfo) {
        this.formatList('ul', execInfo);
        continue;
      }

      // ol
      execInfo = OlReg.exec(currentLine);
      if (execInfo) {
        this.formatList('ol', execInfo);
        continue;
      }

      // blockquote
      execInfo = BlockquoteReg.exec(currentLine);
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

  public getResult() {
    return this.result;
  }

  private formatLine(line: string) {
    const tmp = [];
    const newLine = this.formatImgAndLink(line, tmp);
    return { type: 'line', childs: this.splitGroupLine(newLine, tmp) };
  }

  // 用来处理包含bold、italic等的一行内容
  private splitGroupLine(line, tmp, onlyText?: boolean) {
    const result = [];
    line.split(this.innerSplit).forEach((value) => {
      if (!value) {
        return;
      }
      if (/^\d+$/.test(value)) {
        result.push(tmp[value]);
      } else if (onlyText) {
        result.push({ type: 'text', value });
      } else {
        result.push(...this.formatInlineStyle(value));
      }
    });
    return result;
  }

  private formatList(type, listInfo) {
    this.insertToResult({
      type,
      level: listInfo[1].length,
      childs: [{
        type: 'item',
        childs: [this.formatLine(listInfo[2])],
      }],
    });
  }

  private formatTask(taskInfo) {
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

  private formatImgAndLink(line: string, contentList) {
    let newLine = line;
    while (ImgAndLinkReg.test(newLine)) {
      newLine = newLine.replace(ImgAndLinkReg, (match, imgTitle, imgSrc, linkTitle, linkHref) => {
        if (imgTitle || imgSrc) {
          contentList.push({ type: 'img', alt: imgTitle, src: imgSrc });
        } else if (linkTitle || linkHref) {
          contentList.push({ type: 'link', childs: this.splitGroupLine(linkTitle, contentList), href: linkHref });
        } else {
          return match;
        }
        return this.innerSplit + (contentList.length - 1) + this.innerSplit;
      });
    }
    return newLine;
  }

  private formatInlineStyle(line: string, tmp?: any) {
    tmp = tmp || [];
    let newLine = line;
    const regList = [
      { type: 'bold', reg: BoldReg, replace: (boldContent) => (boldContent && this.formatInlineStyle(boldContent, tmp)) },
      { type: 'italic', reg: ItalicReg, replace: (itaOne, itaTwo) => (this.formatInlineStyle(itaOne || itaTwo, tmp)) },
      { type: 'delete', reg: DelReg, replace: (delContent) => (delContent && this.formatInlineStyle(delContent, tmp)) },
      { type: 'highLight', reg: HighLightReg, replace: (high) => (high && this.formatInlineStyle(high, tmp)) },
      { type: 'inlineCode', reg: inlineCodeReg },
      { type: 'sub', reg: SubReg },
      { type: 'sup', reg: SupReg },
    ];
    regList.forEach((regInfo: any) => {
      while (regInfo.reg.test(newLine)) {
        newLine = newLine.replace(regInfo.reg, (_, ...args) => {
          if (regInfo.replace) {
            const childs = (regInfo.replace as any)(...args);
            if (!childs) {
              return '';
            }
            tmp.push({ type: regInfo.type, childs });
          } else {
            tmp.push({ type: regInfo.type, value: args[0] });
          }
          return  this.innerSplit + (tmp.length - 1) + this.innerSplit;
        });
      }
    });
    return this.splitGroupLine(newLine, tmp, true);
  }

  private insertToResult(item, result?) {
    result = result || this.result;
    const pre = result && result[result.length - 1];
    if (pre && pre.type === 'head') {
      if (item.type === 'head' && pre.level >= item.level) {
        result.push(item);
      } else {
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

  private insertNotMatch(currentLine) {
    this.insertToResult({ type: 'line', childs: [{type: 'text', value: currentLine }]}, this.result);
  }
}
