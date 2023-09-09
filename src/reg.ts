import { Item, ItemType } from './interface';

export const BlockquoteReg = /^(>{1,})\s+(.*)$/;
export const BoldReg = /\*{2}([^\*].*?)\*{2}|\*{4}/g;
export const inlineCodeReg = /`([^`]+)`/;
export const HeadReg = /^(#{1,6})\s+(.*)$/;
export const HollowReg = /\{\{([^{}]*?)\}\}/g; // 挖空语法 {{}}
export const HrReg = /^\s*---\s*$/;
export const ItalicReg = /_([^_].*?)_|\*([^\*].*?)\*/g;
export const ImgAndLinkReg = /!\[([^\[\(]*)\]\((.*?)\)|\[([^\[\(]*)\]\((.*?)\)/g;
export const OlReg = /^(\s*)\d+\.\s+(.*)$/;
export const TaskReg = /^(\s*)-\s+\[(\s+|\s*x\s*)\]\s+(.*)$/;
export const UlReg = /^(\s*)[-+\*]\s+(.*)$/;
export const DelReg = /~~([^~].*?)~~/g;
export const SubReg = /~([^~]+)~/g;
export const SupReg = /\^([^\^]+)\^/g;
export const HighLightReg = /==([^=]+)==/g;

export const multiLineReg = [
    {
        // code ```lang
        start: /^`{3}(.*)$/,
        getItem: (execInfo: string[]): Item => ({ type: ItemType.Code, multiLines: true, lang: execInfo[1] || '', childs: []}),
    },
    {
        // enc >enc ... enc<
        start: /^>enc:?(\w+)?$/,
        end: /^enc<$/,
        getItem: (execInfo: string[]): Item => ({ type: ItemType.Enc, multiLines: true, title: execInfo[1] || '', childs: []}),
    },
];
