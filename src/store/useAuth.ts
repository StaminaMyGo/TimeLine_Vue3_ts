import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User } from '@supabase/supabase-js'
import { supabase } from '../utils/supabase'

export const useAuthStore = defineStore('auth', () => {
  // 状态
  const user = ref<User | null>(null)
  const isLoggedIn = ref(false)

  // 登录方法
  async function login(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error('登录失败:', error.message)
      return { success: false, error }
    } else {
      console.log('登录成功:', data.user)
      user.value = data.user
      isLoggedIn.value = true
      return { success: true, data }
    }
  }

  // 退出登录
  async function logout() {
    await supabase.auth.signOut()
    user.value = null
    isLoggedIn.value = false
  }
  // 新增：初始化时恢复已有会话
  async function initAuth() {
    const { data } = await supabase.auth.getSession()
    if (data.session) {
      user.value = data.session.user
      isLoggedIn.value = true
    }
  }

  return { user, isLoggedIn, login, logout,initAuth }
})