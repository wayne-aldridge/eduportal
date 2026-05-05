<script setup>
import { RouterLink } from 'vue-router'
import { dashboardNavLinks } from '../data/mockData'

defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['close', 'sign-out'])
</script>

<template>
  <Transition name="fade">
    <div v-if="isOpen" class="sidebar-backdrop" @click="$emit('close')" />
  </Transition>

  <aside class="sidebar" :class="{ 'is-open': isOpen }">
    <div class="sidebar-top">
      <RouterLink class="brand" to="/dashboard">
        <span class="brand-mark">🎓</span>
        <span class="brand-name">EDUPORTAL</span>
      </RouterLink>

      <button
        class="icon-button mobile-only"
        type="button"
        aria-label="Close sidebar"
        @click="$emit('close')"
      >
        ✕
      </button>
    </div>

    <p class="sidebar-section-label">Main Menu</p>

    <nav class="sidebar-nav" aria-label="Dashboard navigation">
      <RouterLink
        v-for="link in dashboardNavLinks"
        :key="link.to"
        :to="link.to"
        class="sidebar-link"
        active-class="is-active"
      >
        <span class="sidebar-link-icon" aria-hidden="true">{{ link.icon }}</span>
        <span>{{ link.label }}</span>
      </RouterLink>
    </nav>
    <button class="button button-gold full-width sidebar-signout mobile-only" @click="$emit('sign-out')">
      Sign Out
    </button>
  </aside>
</template>
