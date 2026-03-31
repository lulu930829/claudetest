<template>
  <div class="login-page">
    <van-nav-bar
      title="登录"
      left-arrow
      @click-left="goBack"
      placeholder
      safe-area-inset-top
    />

    <div class="login-container">
      <!-- Logo -->
      <div class="logo-section">
        <van-image
          src="https://fastly.jsdelivr.net/npm/@vant/assets/logo.png"
          width="80"
          height="80"
          round
        />
        <h2 class="app-title">{{ appTitle }}</h2>
      </div>

      <!-- 登录表单 -->
      <van-form @submit="onSubmit" class="login-form">
        <van-cell-group inset>
          <van-field
            v-model="loginForm.phone"
            type="tel"
            label="手机号"
            placeholder="请输入手机号"
            :rules="[{ required: true, message: '请输入手机号' }]"
            maxlength="11"
          />
          <van-field
            v-model="loginForm.password"
            type="password"
            label="密码"
            placeholder="请输入密码"
            :rules="[{ required: true, message: '请输入密码' }]"
          />
        </van-cell-group>

        <!-- 验证码登录切换 -->
        <div class="login-type">
          <van-button
            type="primary"
            size="small"
            plain
            @click="toggleLoginType"
          >
            {{ isCaptchaLogin ? '密码登录' : '验证码登录' }}
          </van-button>
        </div>

        <!-- 登录按钮 -->
        <div class="submit-button">
          <van-button
            round
            block
            type="primary"
            native-type="submit"
            :loading="loading"
          >
            登录
          </van-button>
        </div>

        <!-- 第三方登录 -->
        <div class="social-login">
          <div class="divider">其他登录方式</div>
          <div class="social-buttons">
            <van-button
              round
              icon="wechat"
              class="wechat-btn"
              @click="onWechatLogin"
            >
              微信
            </van-button>
            <van-button
              round
              icon="qq"
              class="qq-btn"
              @click="onQQLogin"
            >
              QQ
            </van-button>
            <van-button
              round
              icon="weibo"
              class="weibo-btn"
              @click="onWeiboLogin"
            >
              微博
            </van-button>
          </div>
        </div>

        <!-- 注册链接 -->
        <div class="register-link">
          还没有账号？
          <router-link to="/register">立即注册</router-link>
        </div>
      </van-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { showToast } from 'vant'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const appTitle = import.meta.env.VITE_APP_TITLE || '商城App'

const loginForm = ref({
  phone: '',
  password: '',
  captcha: '',
})

const isCaptchaLogin = ref(false)
const loading = ref(false)

const onSubmit = async () => {
  loading.value = true
  try {
    const result = await userStore.login(loginForm.value)
    if (result.success) {
      showToast('登录成功')

      // 跳转到重定向页面或首页
      const redirect = route.query.redirect as string
      if (redirect) {
        router.push(redirect)
      } else {
        router.push({ name: 'Home' })
      }
    } else {
      showToast(result.message || '登录失败')
    }
  } catch (error) {
    console.error('登录出错:', error)
    showToast('登录失败，请重试')
  } finally {
    loading.value = false
  }
}

const toggleLoginType = () => {
  isCaptchaLogin.value = !isCaptchaLogin.value
  if (isCaptchaLogin.value) {
    // 切换到验证码登录
    loginForm.value.password = ''
  } else {
    // 切换到密码登录
    loginForm.value.captcha = ''
  }
}

const onWechatLogin = () => {
  userStore.socialLogin('wechat')
}

const onQQLogin = () => {
  userStore.socialLogin('qq')
}

const onWeiboLogin = () => {
  userStore.socialLogin('weibo')
}

const goBack = () => {
  router.go(-1)
}
</script>

<style scoped lang="scss">
.login-page {
  min-height: 100vh;
  background-color: #f7f8fa;

  .login-container {
    padding: 40px 20px;

    .logo-section {
      text-align: center;
      margin-bottom: 40px;

      .app-title {
        margin-top: 16px;
        font-size: 20px;
        color: #333;
        font-weight: bold;
      }
    }

    .login-form {
      .login-type {
        text-align: right;
        margin: 12px 0 24px;
        padding: 0 16px;
      }

      .submit-button {
        margin: 24px 16px;
      }

      .social-login {
        margin: 40px 16px;

        .divider {
          text-align: center;
          position: relative;
          margin: 24px 0;
          color: #999;

          &::before,
          &::after {
            content: '';
            position: absolute;
            top: 50%;
            width: 30%;
            height: 1px;
            background-color: #e5e5e5;
          }

          &::before {
            left: 0;
          }

          &::after {
            right: 0;
          }
        }

        .social-buttons {
          display: flex;
          justify-content: center;
          gap: 20px;

          .wechat-btn {
            background-color: #07c160;
            border-color: #07c160;
            color: white;
          }

          .qq-btn {
            background-color: #12b7f5;
            border-color: #12b7f5;
            color: white;
          }

          .weibo-btn {
            background-color: #e6162d;
            border-color: #e6162d;
            color: white;
          }
        }
      }

      .register-link {
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