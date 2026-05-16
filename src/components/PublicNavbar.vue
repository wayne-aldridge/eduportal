<script setup>
import { ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { publicNavLinks } from '../data/mockData'
import AppLogo from './AppLogo.vue'

const route = useRoute()
const mobileOpen = ref(false)

watch(
  () => route.fullPath,
  () => {
    mobileOpen.value = false
  },
)
</script>

<template>
  <header class="site-header">
    <div class="container nav-wrap">
      <RouterLink class="brand" to="/" aria-label="Home">
        <AppLogo class="desktop-logo" />
      </RouterLink>

      <nav class="desktop-nav" aria-label="Primary">
        <RouterLink
          v-for="link in publicNavLinks"
          :key="link.to"
          :to="link.to"
          class="nav-link"
          active-class="is-active"
        >
          {{ link.label }}
        </RouterLink>
      </nav>

      <div class="nav-actions desktop-actions">
        <RouterLink class="text-link" to="/login">Login</RouterLink>
        <RouterLink class="button button-gold compact" to="/enrollment">Enroll Now</RouterLink>
      </div>

      <button
        class="icon-button mobile-only nav-toggle"
        type="button"
        :aria-expanded="mobileOpen"
        aria-label="Toggle navigation menu"
        @click="mobileOpen = !mobileOpen"
      >
        <span class="menu-icon" :class="{ 'is-open': mobileOpen }" aria-hidden="true">
          <span></span>
          <span></span>
          <span></span>
        </span>
      </button>
    </div>

    <Transition name="menu-drop">
      <div v-if="mobileOpen" class="mobile-menu">
        <nav class="mobile-menu-links" aria-label="Mobile primary">
          <RouterLink
            v-for="link in publicNavLinks"
            :key="link.to"
            :to="link.to"
            class="mobile-nav-link"
            active-class="is-active"
          >
            {{ link.label }}
          </RouterLink>
          <RouterLink class="mobile-nav-link" to="/login">Login</RouterLink>
          <RouterLink class="mobile-nav-link" to="/enrollment">
            Enroll Now
          </RouterLink>
        </nav>
      </div>
    </Transition>
  </header>
</template>
