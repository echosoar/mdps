export type Item = IBlockquoteItem | ICodeItem | IEmptyItem | IEncType | IHeadItem | IHrItem | IItem | ILineItem | IListItem | ITask | ITaskItem | ITextItem | ITableItem | ITableHeadItem | ITableLineItem | ITableCellItem;

export interface IBaseItem {
    type: ItemType;
    level?: number;
    multiLines?: boolean;
    childs?: Item[];
}

export  interface IBlockquoteItem extends IBaseItem {
    type: ItemType.Blockquote;
}

export  interface ICodeItem extends IBaseItem {
    type: ItemType.Code;
    lang: string;
}

export  interface IEmptyItem extends IBaseItem {
    type: ItemType.Empty;
}

export  interface IEncType extends IBaseItem {
    type: ItemType.Enc;
    title: string;
}

export  interface IHeadItem extends IBaseItem {
    type: ItemType.Head;
    level: number;
    value: string;
}

export  interface IHrItem extends IBaseItem {
    type: ItemType.Hr;
}

export  interface IItem extends IBaseItem {
    type: ItemType.Item;
}

export  interface ITaskItem extends IItem {
    complete: boolean;
}

export  interface ILineItem extends IBaseItem {
    type: ItemType.Line;
}

export  interface IListItem extends IBaseItem {
    type: ItemType.OrderList | ItemType.UnOrderList;
}

export  interface ITask extends IBaseItem {
    type: ItemType.Task;
    level: number;
}

export  interface ITextItem extends IBaseItem {
    type: ItemType.Text;
    value: string;
}

export  interface ITableItem extends IBaseItem {
    type: ItemType.Table;
    tableHead?: ITableHeadItem[];
}

export  interface ITableHeadItem extends IBaseItem {
    type: ItemType.TableHead;
    align?: 'left' | 'right' | 'center';
    value?: string;
}

export  interface ITableLineItem extends IBaseItem {
    type: ItemType.TableLine;
}

export  interface ITableCellItem extends IBaseItem {
    type: ItemType.TableItem;
}

export enum ItemType {
    Blockquote = 'blockquote',
    Code = 'code',
    Empty = 'empty',
    Enc = 'enc',
    Head = 'head',
    Hr = 'hr',
    Item = 'item',
    Line = 'line',
    OrderList = 'ol',
    Task = 'task',
    Text = 'text',
    UnOrderList = 'ul',
    Table = 'table',
    TableHead = 'tableHead',
    TableLine = 'tableLine',
    TableItem = 'tableItem',
}

export interface IMarkdownInfo {
    links: {
      [link: string]: {
        title?: string;
        link: string;
      };
    };
    text: string;
    length: number;
    toc: IMarkdownToc[];
}

export interface IMarkdownToc {
    title: string;
    level: number;
    childs: IMarkdownToc[];
}
