<template>
  <div class="register-page">
    <van-nav-bar title="注册" left-arrow @click-left="goBack" placeholder safe-area-inset-top />

    <div class="register-container">
      <van-form @submit="onSubmit" class="register-form">
        <van-cell-group inset>
          <van-field
            v-model="registerForm.phone"
            type="tel"
            label="手机号"
            placeholder="请输入手机号"
            :rules="[
              { required: true, message: '请输入手机号' },
              { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确' },
            ]"
            maxlength="11"
          />
          <van-field
            v-model="registerForm.username"
            label="用户名"
            placeholder="请输入用户名"
            :rules="[{ required: true, message: '请输入用户名' }]"
          />
          <van-field
            v-model="registerForm.password"
            type="password"
            label="密码"
            placeholder="请输入密码"
            :rules="[
              { required: true, message: '请输入密码' },
              { min: 6, message: '密码至少6位' },
            ]"
          />
          <van-field
            v-model="registerForm.confirmPassword"
            type="password"
            label="确认密码"
            placeholder="请再次输入密码"
            :rules="[
              { required: true, message: '请确认密码' },
              { validator: validateConfirmPassword, message: '两次密码不一致' },
            ]"
          />
          <van-field
            v-model="registerForm.email"
            type="email"
            label="邮箱"
            placeholder="请输入邮箱（可选）"
          />
        </van-cell-group>

        <!-- 注册协议 -->
        <div class="agreement">
          <van-checkbox v-model="agreed" shape="square">
            我已阅读并同意
            <router-link to="/agreement" class="link">《用户协议》</router-link>
            和
            <router-link to="/privacy" class="link">《隐私政策》</router-link>
          </van-checkbox>
        </div>

        <!-- 注册按钮 -->
        <div class="submit-button">
          <van-button
            round
            block
            type="primary"
            native-type="submit"
            :disabled="!agreed"
            :loading="loading"
          >
            注册
          </van-button>
        </div>

        <!-- 登录链接 -->
        <div class="login-link">
          已有账号？
          <router-link to="/login">立即登录</router-link>
        </div>
      </van-form>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { showToast } from 'vant'
  import { useUserStore } from '@/stores/user'
  import type { RegisterParams } from '@/types/user'

  const router = useRouter()
  const userStore = useUserStore()

  const registerForm = ref<RegisterParams>({
    phone: '',
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
  })
  const agreed = ref(false)
  const loading = ref(false)

  const validateConfirmPassword = (val: string) => {
    return val === registerForm.value.password
  }

  const onSubmit = async () => {
    if (!agreed.value) {
      showToast('请阅读并同意用户协议')
      return
    }

    loading.value = true
    try {
      const result = await userStore.register(registerForm.value)
      if (result.success) {
        showToast('注册成功')
        router.push({ name: 'Home' })
      } else {
        showToast(result.message || '注册失败')
      }
    } catch (error) {
      console.error('注册出错:', error)
      showToast('注册失败，请重试')
    } finally {
      loading.value = false
    }
  }

  const goBack = () => {
    router.go(-1)
  }
</script>

<style scoped lang="scss">
  .register-page {
    min-height: 100vh;
    background-color: #f7f8fa;

    .register-container {
      padding: 40px 20px;

      .register-form {
        .agreement {
          margin: 20px 16px;
          font-size: 14px;

          .link {
            color: var(--van-primary-color);
          }
        }

        .submit-button {
          margin: 24px 16px;
        }

        .login-link {
          text-align: center;
          margin-top: 24px;
          color: #666;

          a {
            color: var(--van-primary-color);
            font-weight: bold;
          }
        }
      }
    }
  }
</style>
