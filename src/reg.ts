export const BlockquoteReg = /^(>{1,})\s+(.*)$/;
export const BoldReg = /\*{2}([^\*].*?)\*{2}|\*{4}/g;
export const CodeReg = /^`{3}(.*)$/;
export const HeadReg = /^(#{1,6})\s+(.*)$/;
export const HrReg = /^\s*---\s*$/;
export const ItalicReg = /_([^_].*?)_|\*([^\*].*?)\*/g;
export const ImgAndLinkReg = /!\[([^\[\(]*)\]\((.*?)\)|\[([^\[\(]*)\]\((.*?)\)/g;
export const OlReg = /^(\s*)\d+\.\s+(.*)$/;
export const TaskReg = /^(\s*)-\s+\[(\s+|\s*x\s*)\]\s+(.*)$/;
export const UlReg = /^(\s*)[-+\*]\s+(.*)$/;
export const DelReg = /~~([^~].*?)~~/g;