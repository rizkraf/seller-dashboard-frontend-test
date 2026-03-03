<template>
  <div class="flex h-screen">
    <aside class="w-64 bg-zinc-50 border-r border-gray-200">
      <div class="p-6">
        <h2 class="text-2xl font-bold mb-8">Dashboard</h2>
        <nav class="space-y-4">
          <router-link
            to="/dashboard"
            class="block px-4 py-2 rounded-md hover:bg-blue-600 hover:text-white transition-colors duration-200"
            exact-active-class="bg-blue-600 text-white"
          >
            Home
          </router-link>
          <router-link
            to="/dashboard/product"
            class="block px-4 py-2 rounded-md hover:bg-blue-600 hover:text-white transition-colors duration-200"
            exact-active-class="bg-blue-600 text-white"
          >
            Product
          </router-link>
        </nav>
      </div>
    </aside>
    <main class="flex-1">
      <router-view></router-view>
    </main>
  </div>
</template>
