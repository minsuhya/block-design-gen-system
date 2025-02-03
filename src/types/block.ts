export interface Block {
  id: string;
  type: BlockType;
  title: string;
  layout: Layout;
  elements: Element[];
}

export enum BlockType {
  BANNER = 'banner',
  PRODUCT_LIST = 'product_list',
  TEXT = 'text'
}

export interface Layout {
  columns: number;
  rows: number;
  gap: number;
}

export interface Element {
  id: string;
  type: ElementType;
  content: any;
  position: Position;
}

export enum ElementType {
  BANNER = 'banner',
  PRODUCT = 'product',
  TEXT = 'text'
}

export interface Position {
  x: number;
  y: number;
  width: number;
  height: number;
}