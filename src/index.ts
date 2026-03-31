import { IMarkdownInfo, Item, ItemType } from './interface';
import {
  BlockquoteReg,
  BoldReg,
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
  HollowReg,
  multiLineReg,
  TableReg,
  TableSeparatorReg,
} from './reg';
export default class Mdps {
  private innerSplit: string = ':mdps:&:split:';
  private referenceIndexPrefix: string = 'mdps:ref:prefix:';
  private result: any = [];
  private info: IMarkdownInfo = {
    links: {},
    length: 0,
    text: '',
    toc: [],
  };
  private notMatch: boolean = false;
  public parse(mdContent: string) {
    const allLine = mdContent.split(/\n/);
    let execInfo = null;
    lineCycle:
    while (allLine.length) {
      const currentLine = allLine.shift();
      // multi line: code、enc
      for (const multilineRegInfo of multiLineReg) {
        const startReg = multilineRegInfo.start;
        const endReg = multilineRegInfo.end || startReg;
        execInfo = (!this.notMatch ? startReg : endReg).exec(currentLine);
        if (execInfo) {
          if (!this.notMatch) {
            this.notMatch = true;
            this.insertToResult(multilineRegInfo.getItem(execInfo));
          } else {
            this.notMatch = false;
          }
          continue lineCycle;
        }
      }

      if (this.notMatch) {
        this.insertNotMatch(currentLine);
        continue;
      }

      // empty line
      if (/^\s*$/.test(currentLine)) {
        this.insertToResult({ type: ItemType.Empty });
        continue;
      }

      // hr
      if (HrReg.test(currentLine)) {
        this.insertToResult({ type: ItemType.Hr });
        continue;
      }

      // head1 to head6
      execInfo = HeadReg.exec(currentLine);
      if (execInfo) {
        this.insertToResult({ type: ItemType.Head, level: execInfo[1].length, value: execInfo[2] });
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
        this.formatList(ItemType.UnOrderList, execInfo);
        continue;
      }

      // ol
      execInfo = OlReg.exec(currentLine);
      if (execInfo) {
        this.formatList(ItemType.OrderList, execInfo);
        continue;
      }

      // blockquote
      execInfo = BlockquoteReg.exec(currentLine);
      if (execInfo) {
        this.insertToResult({
          type: ItemType.Blockquote,
          level: execInfo[1].length,
          childs: [{
            type: ItemType.Item,
            childs: [this.formatLine(execInfo[2])],
          }],
        });
        continue;
      }

      // table
      if (TableReg.test(currentLine)) {
        const nextLine = allLine[0];
        if (nextLine && TableSeparatorReg.test(nextLine)) {
          allLine.shift(); // consume separator line
          this.formatTable(currentLine, nextLine, allLine);
          continue;
        }
      }

      this.insertToResult(this.formatLine(currentLine));
    }
  }

  public getResult() {
    return this.result;
  }

  public getInfo(): IMarkdownInfo {
    this.info.length = this.info.text.length;
    return this.info;
  }

  private formatLine(line: string): Item {
    const tmp = [];
    return { type: ItemType.Line, childs: this.splitGroupLine(line, tmp) };
  }

  // 用来处理包含bold、italic等的一行内容
  private splitGroupLine(line, tmp, onlyText?: boolean) {
    const result = [];
    line.split(this.innerSplit).forEach((value) => {
      if (!value) {
        return;
      }
      if (value.startsWith(this.referenceIndexPrefix)) {
        result.push(tmp[value.replace(this.referenceIndexPrefix, '')]);
      } else if (onlyText) {
        result.push({ type: 'text', value });
      } else {
        result.push(...this.formatInlineStyle(value));
      }
    });
    return result;
  }

  private formatList(type: ItemType.OrderList | ItemType.UnOrderList, listInfo: string[]) {
    this.insertToResult({
      type,
      level: listInfo[1].length,
      childs: [{
        type: ItemType.Item,
        childs: [this.formatLine(listInfo[2])],
      }],
    });
  }

  private formatTask(taskInfo: string[]) {
    this.insertToResult({
      type: ItemType.Task,
      level: taskInfo[1].length,
      childs: [{
        type: ItemType.Item,
        complete: !!(taskInfo[2] || '').replace(/\s/g, ''),
        childs: [this.formatLine(taskInfo[3])],
      }],
    });
  }

  private formatTable(headerLine: string, separatorLine: string, allLine: string[]) {
    // Parse header cells
    const headerCells = headerLine.split('|').filter((cell) => cell.trim()).map((cell) => cell.trim());

    // Parse alignment from separator line
    const alignments = separatorLine.split('|').filter((cell) => cell.trim()).map((cell) => {
      const trimmed = cell.trim();
      const hasLeft = trimmed.startsWith(':');
      const hasRight = trimmed.endsWith(':');
      if (hasLeft && hasRight) {
        return 'center' as 'center';
      } else if (hasRight) {
        return 'right' as 'right';
      } else {
        return 'left' as 'left';
      }
    });

    // Create table head
    const tableHead = headerCells.map((cell, index) => ({
      type: ItemType.Text,
      value: cell,
      align: alignments[index] || 'left',
    })) as any;

    // Parse table rows
    const childs: any[] = [];
    while (allLine.length && TableReg.test(allLine[0])) {
      const rowLine = allLine.shift();
      const cells = rowLine.split('|').filter((cell) => cell.trim()).map((cell) => cell.trim());

      const tableItems = cells.map((cell) => ({
        type: ItemType.TableItem,
        childs: [{
          type: ItemType.Text,
          value: cell,
        }],
      }));

      childs.push({
        type: ItemType.TableLine,
        childs: tableItems,
      });
    }

    this.insertToResult({
      type: ItemType.Table,
      tableHead,
      childs,
    } as any);
  }

  private formatInlineStyle(line: string, tmp?: any) {
    tmp = tmp || [];
    let newLine = line;
    const regList = [
      { type: 'imgOrLink', reg: ImgAndLinkReg, replace: (imgTitle, imgSrc, linkTitle, linkHref) => {
        if (imgTitle || imgSrc) {
          return { type: 'img', alt: imgTitle, src: imgSrc };
        } else if (linkTitle || linkHref) {
          return { type: 'link', childs: this.splitGroupLine(linkTitle, tmp), href: linkHref };
        }
      }},
      { type: 'bold', reg: BoldReg, replace: (boldContent) => (boldContent && this.formatInlineStyle(boldContent, tmp)) },
      { type: 'italic', reg: ItalicReg, replace: (itaOne, itaTwo) => (this.formatInlineStyle(itaOne || itaTwo, tmp)) },
      { type: 'delete', reg: DelReg, replace: (delContent) => (delContent && this.formatInlineStyle(delContent, tmp)) },
      { type: 'highLight', reg: HighLightReg, replace: (high) => (high && this.formatInlineStyle(high, tmp)) },
      { type: 'hollow', reg: HollowReg,  replace: (hollow) => (hollow && this.formatInlineStyle(hollow, tmp)) },
      { type: 'inlineCode', reg: inlineCodeReg },
      { type: 'sub', reg: SubReg },
      { type: 'sup', reg: SupReg },
    ];
    regList.forEach((regInfo: any) => {
      while (regInfo.reg.test(newLine)) {
        newLine = newLine.replace(regInfo.reg, (_, ...args) => {
          if (regInfo.replace) {
            const childs = (regInfo.replace as any)(...args);
            if (!childs || childs.match) {
              return childs?.match || '';
            }
            if (childs.type) {
              tmp.push(childs);
            } else {
              tmp.push({ type: regInfo.type, childs });
            }
          } else {
            tmp.push({ type: regInfo.type, value: args[0] });
          }
          return  this.innerSplit + this.referenceIndexPrefix + (tmp.length - 1) + this.innerSplit;
        });
      }
    });
    return this.splitGroupLine(newLine, tmp, true);
  }

  private insertToResult(item: Item, result?: Item[]) {
    result = result || this.result;
    const pre: Item = result && result[result.length - 1];
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
    if (pre && pre.multiLines && this.notMatch) {
      this.insertToResult(item, pre.childs);
      return;
    }
    if (item.type === ItemType.Empty && result.length === 0) {
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

  private insertNotMatch(currentLine: string) {
    this.insertToResult({ type: ItemType.Line, childs: [{type: ItemType.Text, value: currentLine }]}, this.result);
  }
}
