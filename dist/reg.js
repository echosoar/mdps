"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockquoteReg = /^(>{1,})\s+(.*)$/;
exports.BoldReg = /\*{2}([^\*].*?)\*{2}|\*{4}/g;
exports.CodeReg = /^`{3}(.*)$/;
exports.HeadReg = /^(#{1,6})\s+(.*)$/;
exports.HrReg = /^\s*---\s*$/;
exports.ItalicReg = /_([^_].*?)_|\*([^\*].*?)\*/g;
exports.ImgAndLinkReg = /!\[([^\[\(]*)\]\((.*?)\)|\[([^\[\(]*)\]\((.*?)\)/g;
exports.OlReg = /^(\s*)\d+\.\s+(.*)$/;
exports.TaskReg = /^(\s*)-\s+\[(\s+|\s*x\s*)\]\s+(.*)$/;
exports.UlReg = /^(\s*)[-+\*]\s+(.*)$/;
