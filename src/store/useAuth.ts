import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User } from '@supabase/supabase-js'
import { supabase } from '../utils/supabase'

export type AuthState = 'loading' | 'authenticated' | 'anon'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const isLoggedIn = ref(false)
  const authState = ref<AuthState>('loading')
  const showLoginModal = ref(false)

  async function login(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      console.error('登录失败:', error.message)
      return { success: false, error }
    }
    console.log('登录成功:', data.user)
    user.value = data.user
    isLoggedIn.value = true
    authState.value = 'authenticated'
    showLoginModal.value = false
    return { success: true, data }
  }

  async function logout() {
    await supabase.auth.signOut()
    user.value = null
    isLoggedIn.value = false
    authState.value = 'anon'
  }

  async function initAuth() {
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
        user.value = session?.user ?? null
        isLoggedIn.value = !!session?.user
        authState.value = 'authenticated'
      } else if (event === 'SIGNED_OUT') {
        user.value = null
        isLoggedIn.value = false
        authState.value = 'anon'
      }
    })

    const { data } = await supabase.auth.getSession()
    if (data.session) {
      user.value = data.session.user
      isLoggedIn.value = true
      authState.value = 'authenticated'
    } else {
      authState.value = 'anon'
      showLoginModal.value = true
    }
  }

  function openLoginModal() {
    showLoginModal.value = true
  }

  function closeLoginModal() {
    showLoginModal.value = false
    if (authState.value === 'loading') {
      authState.value = 'anon'
    }
  }

  return { user, isLoggedIn, authState, showLoginModal, login, logout, initAuth, openLoginModal, closeLoginModal }
})
