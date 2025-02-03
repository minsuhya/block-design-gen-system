<script setup lang="ts">
import { RouterView } from 'vue-router';
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <nav class="bg-white shadow-md p-4">
      <div class="container mx-auto">
        <router-link to="/" class="mr-4 text-gray-700 hover:text-primary-600 font-medium">메인</router-link>
        <router-link to="/admin" class="text-gray-700 hover:text-primary-600 font-medium">관리자</router-link>
      </div>
    </nav>
    
    <main class="container mx-auto py-8">
      <RouterView />
    </main>
  </div>
</template>