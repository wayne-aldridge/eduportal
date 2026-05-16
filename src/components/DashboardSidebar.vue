<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { enrollmentState } from '../data/enrollmentStore'
import AppLogo from './AppLogo.vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  isMobileView: {
    type: Boolean,
    default: false,
  },
  profileName: {
    type: String,
    default: '',
  },
  profileMeta: {
    type: String,
    default: '',
  },
})

defineEmits(['close'])

const dashboardNavLinks = computed(() =>
  enrollmentState.session.role === 'Admin'
    ? [{ label: 'Admin Dashboard', to: '/admin', icon: 'A' }]
    : [
        { label: 'Dashboard', to: '/dashboard', icon: 'D' },
        { label: 'Account', to: '/account', icon: 'P' },
      ],
)

const homeRoute = computed(() =>
  enrollmentState.session.role === 'Admin' ? '/admin' : '/dashboard',
)

const profileInitials = computed(() => {
  if (!String(props.profileName || '').trim()) return 'EP'

  return props.profileName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('')
})
</script>

<template>
  <Transition name="fade">
    <div v-if="isMobileView && isOpen" class="sidebar-backdrop" @click="$emit('close')" />
  </Transition>

  <aside class="sidebar" :class="{ 'is-open': isOpen }">
    <div class="sidebar-top">
      <RouterLink class="brand" :to="homeRoute" aria-label="Dashboard home">
        <AppLogo />
      </RouterLink>

      <button
        v-if="isMobileView"
        class="icon-button mobile-only"
        type="button"
        aria-label="Close sidebar"
        @click="$emit('close')"
      >
        <span class="menu-close-icon" aria-hidden="true"></span>
      </button>
    </div>

    <p class="sidebar-section-label">Main Menu</p>

    <nav class="sidebar-nav" aria-label="Dashboard navigation">
      <RouterLink
        v-for="link in dashboardNavLinks"
        :key="link.to"
        :to="link.to"
        class="sidebar-link"
        exact-active-class="is-active"
      >
        <span class="sidebar-link-icon" aria-hidden="true">{{ link.icon }}</span>
        <span>{{ link.label }}</span>
      </RouterLink>
    </nav>

    <div class="sidebar-profile">
      <span class="sidebar-profile-avatar" aria-hidden="true">{{ profileInitials }}</span>
      <div class="sidebar-profile-copy">
        <p class="sidebar-profile-name">{{ profileName }}</p>
        <p class="sidebar-profile-meta">{{ profileMeta }}</p>
      </div>
    </div>
  </aside>
</template>
