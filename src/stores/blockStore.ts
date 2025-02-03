import { defineStore } from 'pinia';
import { Block } from '../types/block';

export const useBlockStore = defineStore('blocks', {
  state: () => ({
    blocks: [] as Block[],
  }),
  
  actions: {
    addBlock(block: Block) {
      this.blocks.push(block);
      this.saveBlocks();
    },
    
    updateBlock(blockId: string, updatedBlock: Block) {
      const index = this.blocks.findIndex(b => b.id === blockId);
      if (index !== -1) {
        this.blocks[index] = updatedBlock;
        this.saveBlocks();
      }
    },
    
    deleteBlock(blockId: string) {
      this.blocks = this.blocks.filter(b => b.id !== blockId);
      this.saveBlocks();
    },
    
    saveBlocks() {
      localStorage.setItem('blocks', JSON.stringify(this.blocks));
    },
    
    loadBlocks() {
      const savedBlocks = localStorage.getItem('blocks');
      if (savedBlocks) {
        this.blocks = JSON.parse(savedBlocks);
      }
    }
  }
});