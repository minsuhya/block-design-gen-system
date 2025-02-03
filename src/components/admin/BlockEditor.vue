<script setup lang="ts">
import { ref, computed } from 'vue';
import { Block, BlockType, Layout, Element, ElementType, Position } from '../../types/block';
import { useBlockStore } from '../../stores/blockStore';
import draggable from 'vuedraggable';

const blockStore = useBlockStore();

const newBlock = ref<Partial<Block>>({
  type: BlockType.BANNER,
  title: '',
  layout: {
    columns: 2,
    rows: 2,
    gap: 16
  },
  elements: []
});

const selectedElement = ref<Element | null>(null);

const elementTemplates = [
  {
    type: ElementType.BANNER,
    title: '배너',
    icon: '🖼️',
    defaultContent: {
      imageUrl: 'https://via.placeholder.com/400x200',
      alt: '배너 이미지'
    }
  },
  {
    type: ElementType.PRODUCT,
    title: '상품',
    icon: '🛍️',
    defaultContent: {
      imageUrl: 'https://via.placeholder.com/200x200',
      name: '상품명',
      price: '10,000원'
    }
  },
  {
    type: ElementType.TEXT,
    title: '텍스트',
    icon: '📝',
    defaultContent: {
      text: '텍스트를 입력하세요'
    }
  }
];

const layoutElements = ref<Element[]>([]);

const handleDrop = (event: DragEvent) => {
  const elementType = event.dataTransfer?.getData('elementType');
  if (!elementType) return;

  const template = elementTemplates.find(t => t.type === elementType);
  if (!template) return;

  const rect = (event.target as HTMLElement).getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  const newElement: Element = {
    id: crypto.randomUUID(),
    type: template.type as ElementType,
    content: { ...template.defaultContent },
    position: {
      x: Math.floor(x / 100),
      y: Math.floor(y / 100),
      width: 1,
      height: 1
    }
  };

  layoutElements.value.push(newElement);
};

const saveBlock = () => {
  if (newBlock.value.title && newBlock.value.type) {
    blockStore.addBlock({
      ...newBlock.value,
      id: crypto.randomUUID(),
      elements: layoutElements.value
    } as Block);
    resetForm();
  }
};

const resetForm = () => {
  newBlock.value = {
    type: BlockType.BANNER,
    title: '',
    layout: {
      columns: 2,
      rows: 2,
      gap: 16
    },
    elements: []
  };
  layoutElements.value = [];
  selectedElement.value = null;
};

const updateElementPosition = (element: Element, position: Partial<Position>) => {
  const index = layoutElements.value.findIndex(e => e.id === element.id);
  if (index !== -1) {
    layoutElements.value[index] = {
      ...element,
      position: {
        ...element.position,
        ...position
      }
    };
  }
};
</script>

<template>
  <div class="flex h-screen bg-gray-50">
    <!-- 왼쪽 엘리먼트 패널 -->
    <div class="w-72 bg-white border-r border-gray-200 p-6 overflow-y-auto">
      <h3 class="text-lg font-bold text-gray-900 mb-4">엘리먼트</h3>
      <div class="space-y-3">
        <div
          v-for="template in elementTemplates"
          :key="template.type"
          class="p-4 bg-white rounded-lg shadow-sm border border-gray-200 cursor-move hover:border-primary-500 hover:shadow-md transition-all flex items-center"
          draggable="true"
          @dragstart="e => {
            e.dataTransfer?.setData('elementType', template.type);
          }"
        >
          <span class="text-2xl mr-3">{{ template.icon }}</span>
          <span class="font-medium text-gray-700">{{ template.title }}</span>
        </div>
      </div>
    </div>

    <!-- 중앙 레이아웃 영역 -->
    <div class="flex-1 p-8 overflow-y-auto">
      <div class="mb-6">
        <input
          v-model="newBlock.title"
          type="text"
          placeholder="블록 제목을 입력하세요"
          class="text-3xl font-bold w-full bg-transparent border-none outline-none text-gray-900 placeholder-gray-400"
        />
      </div>

      <div
        class="bg-white border-2 border-dashed border-gray-300 rounded-xl min-h-[600px] relative shadow-sm"
        @drop.prevent="handleDrop"
        @dragover.prevent
      >
        <div
          class="grid p-6"
          :style="{
            gridTemplateColumns: `repeat(${newBlock.layout.columns}, 1fr)`,
            gap: `${newBlock.layout.gap}px`,
          }"
        >
          <template v-for="element in layoutElements" :key="element.id">
            <div
              class="relative bg-gray-50 rounded-lg p-4 cursor-move border-2 transition-all duration-200"
              :class="{
                'border-primary-500 shadow-lg': selectedElement?.id === element.id,
                'border-transparent hover:border-gray-300': selectedElement?.id !== element.id
              }"
              :style="{
                gridColumn: `span ${element.position.width}`,
                gridRow: `span ${element.position.height}`,
              }"
              @click="selectedElement = element"
            >
              <template v-if="element.type === ElementType.BANNER">
                <img :src="element.content.imageUrl" :alt="element.content.alt" class="w-full h-full object-cover rounded-md" />
              </template>
              <template v-else-if="element.type === ElementType.PRODUCT">
                <div class="bg-white p-4 rounded-lg shadow-sm">
                  <img :src="element.content.imageUrl" :alt="element.content.name" class="w-full mb-3 rounded-md" />
                  <h4 class="font-bold text-gray-900">{{ element.content.name }}</h4>
                  <p class="text-primary-600 font-medium">{{ element.content.price }}</p>
                </div>
              </template>
              <template v-else-if="element.type === ElementType.TEXT">
                <div class="prose max-w-none" v-html="element.content.text"></div>
              </template>
            </div>
          </template>
        </div>
      </div>

      <div class="mt-6">
        <button
          @click="saveBlock"
          class="px-6 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
        >
          블록 저장
        </button>
      </div>
    </div>

    <!-- 오른쪽 속성 패널 -->
    <div class="w-80 bg-white border-l border-gray-200 p-6 overflow-y-auto">
      <h3 class="text-lg font-bold text-gray-900 mb-6">속성</h3>
      
      <!-- 레이아웃 설정 -->
      <div class="mb-8">
        <h4 class="font-medium text-gray-900 mb-4">레이아웃</h4>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm text-gray-600 mb-1">컬럼</label>
            <input
              v-model="newBlock.layout.columns"
              type="number"
              min="1"
              class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div>
            <label class="block text-sm text-gray-600 mb-1">행</label>
            <input
              v-model="newBlock.layout.rows"
              type="number"
              min="1"
              class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div class="col-span-2">
            <label class="block text-sm text-gray-600 mb-1">간격 (px)</label>
            <input
              v-model="newBlock.layout.gap"
              type="number"
              min="0"
              class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <!-- 선택된 엘리먼트 속성 -->
      <template v-if="selectedElement">
        <div class="mb-6">
          <h4 class="font-medium text-gray-900 mb-4">엘리먼트 속성</h4>
          <div class="space-y-4">
            <div>
              <label class="block text-sm text-gray-600 mb-1">너비 (칸)</label>
              <input
                v-model="selectedElement.position.width"
                type="number"
                min="1"
                :max="newBlock.layout.columns"
                class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                @input="updateElementPosition(selectedElement, { width: parseInt($event.target.value) })"
              />
            </div>
            <div>
              <label class="block text-sm text-gray-600 mb-1">높이 (칸)</label>
              <input
                v-model="selectedElement.position.height"
                type="number"
                min="1"
                :max="newBlock.layout.rows"
                class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                @input="updateElementPosition(selectedElement, { height: parseInt($event.target.value) })"
              />
            </div>
            
            <!-- 엘리먼트 타입별 속성 -->
            <template v-if="selectedElement.type === ElementType.BANNER">
              <div>
                <label class="block text-sm text-gray-600 mb-1">이미지 URL</label>
                <input
                  v-model="selectedElement.content.imageUrl"
                  type="text"
                  class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label class="block text-sm text-gray-600 mb-1">대체 텍스트</label>
                <input
                  v-model="selectedElement.content.alt"
                  type="text"
                  class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </template>
            
            <template v-else-if="selectedElement.type === ElementType.PRODUCT">
              <div>
                <label class="block text-sm text-gray-600 mb-1">상품명</label>
                <input
                  v-model="selectedElement.content.name"
                  type="text"
                  class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label class="block text-sm text-gray-600 mb-1">가격</label>
                <input
                  v-model="selectedElement.content.price"
                  type="text"
                  class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </template>
            
            <template v-else-if="selectedElement.type === ElementType.TEXT">
              <div>
                <label class="block text-sm text-gray-600 mb-1">텍스트</label>
                <textarea
                  v-model="selectedElement.content.text"
                  class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  rows="4"
                ></textarea>
              </div>
            </template>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>