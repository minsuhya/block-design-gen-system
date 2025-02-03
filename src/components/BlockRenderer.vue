<script setup lang="ts">
import { computed } from 'vue';
import { useBlockStore } from '../stores/blockStore';
import { Block } from '../types/block';

const blockStore = useBlockStore();
const blocks = computed(() => blockStore.blocks);

const getGridStyle = (layout: Block['layout']) => {
  return {
    display: 'grid',
    gridTemplateColumns: `repeat(${layout.columns}, 1fr)`,
    gap: `${layout.gap}px`,
  };
};
</script>

<template>
  <div class="block-renderer space-y-12">
    <template v-for="block in blocks" :key="block.id">
      <div class="block-container">
        <h3 class="text-2xl font-bold text-gray-900 mb-6">{{ block.title }}</h3>
        <div
          class="block-content bg-white rounded-xl shadow-sm p-6"
          :style="getGridStyle(block.layout)"
        >
          <template v-for="element in block.elements" :key="element.id">
            <div
              class="element"
              :style="{
                gridColumn: `span ${element.position.width}`,
                gridRow: `span ${element.position.height}`,
              }"
            >
              <template v-if="element.type === 'banner'">
                <img 
                  :src="element.content.imageUrl" 
                  :alt="element.content.alt" 
                  class="w-full h-full object-cover rounded-lg shadow-sm" 
                />
              </template>
              <template v-else-if="element.type === 'product'">
                <div class="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow">
                  <img 
                    :src="element.content.imageUrl" 
                    :alt="element.content.name" 
                    class="w-full aspect-square object-cover" 
                  />
                  <div class="p-4">
                    <h4 class="font-bold text-gray-900 mb-2">{{ element.content.name }}</h4>
                    <p class="text-primary-600 font-medium">{{ element.content.price }}</p>
                  </div>
                </div>
              </template>
              <template v-else-if="element.type === 'text'">
                <div class="prose max-w-none p-4" v-html="element.content.text"></div>
              </template>
            </div>
          </template>
        </div>
      </div>
    </template>
  </div>
</template>