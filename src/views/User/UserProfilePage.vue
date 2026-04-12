<template>
  <div class="user-profile-page">
    <van-nav-bar title="个人信息" left-arrow @click-left="goBack" placeholder safe-area-inset-top />

    <van-form @submit="onSubmit" class="profile-form">
      <!-- 头像 -->
      <div class="avatar-section">
        <div class="avatar-label">头像</div>
        <van-uploader
          v-model="avatarFile"
          :after-read="afterRead"
          :max-count="1"
          :preview-image="false"
        >
          <van-image :src="form.avatar" width="60" height="60" round fit="cover" />
          <div class="upload-hint">
            <van-icon name="photo-o" size="16" />
            <span>点击更换</span>
          </div>
        </van-uploader>
      </div>

      <van-cell-group inset>
        <van-field
          v-model="form.name"
          label="昵称"
          placeholder="请输入昵称"
          :rules="[{ required: true, message: '请输入昵称' }]"
        />
        <van-field
          v-model="form.phone"
          type="tel"
          label="手机号"
          placeholder="请输入手机号"
          :rules="[
            { required: true, message: '请输入手机号' },
            { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确' },
          ]"
          readonly
        />
        <van-field v-model="form.email" type="email" label="邮箱" placeholder="请输入邮箱" />
        <van-field
          v-model="form.gender"
          is-link
          readonly
          label="性别"
          placeholder="请选择性别"
          @click="showGenderPicker = true"
        />
        <van-field
          v-model="form.birthday"
          is-link
          readonly
          label="生日"
          placeholder="请选择生日"
          @click="showBirthdayPicker = true"
        />
      </van-cell-group>

      <!-- 提交按钮 -->
      <div class="submit-button">
        <van-button round block type="primary" native-type="submit" :loading="loading">
          保存修改
        </van-button>
      </div>
    </van-form>

    <!-- 性别选择器 -->
    <van-popup v-model:show="showGenderPicker" position="bottom">
      <van-picker
        :columns="genderOptions"
        @confirm="onGenderConfirm"
        @cancel="showGenderPicker = false"
      />
    </van-popup>

    <!-- 生日选择器 -->
    <van-popup v-model:show="showBirthdayPicker" position="bottom">
      <van-date-picker
        v-model="currentDate"
        :min-date="minDate"
        :max-date="maxDate"
        @confirm="onBirthdayConfirm"
        @cancel="showBirthdayPicker = false"
      />
    </van-popup>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { showToast } from 'vant'
  import { useUserStore } from '@/stores/user'
  import type { UpdateUserParams } from '@/types/user'

  const router = useRouter()
  const userStore = useUserStore()

  const form = ref<UpdateUserParams>({
    name: '',
    avatar: '',
    phone: '',
    email: '',
    gender: 'unknown',
    birthday: '',
  })
  const avatarFile = ref<any[]>([])
  const loading = ref(false)
  const showGenderPicker = ref(false)
  const showBirthdayPicker = ref(false)
  const currentDate = ref(['1990', '01', '01'])

  const genderOptions = [
    { text: '男', value: 'male' },
    { text: '女', value: 'female' },
    { text: '保密', value: 'unknown' },
  ]

  const minDate = new Date(1900, 0, 1)
  const maxDate = new Date()

  onMounted(() => {
    loadUserInfo()
  })

  const loadUserInfo = () => {
    if (userStore.userInfo) {
      form.value = {
        name: userStore.userInfo.name,
        avatar: userStore.userInfo.avatar,
        phone: userStore.userInfo.phone || '',
        email: userStore.userInfo.email || '',
        gender: userStore.userInfo.gender || 'unknown',
        birthday: userStore.userInfo.birthday || '',
      }
    }
  }

  const afterRead = (file: any) => {
    // 这里应该上传图片到服务器
    // 模拟上传成功
    setTimeout(() => {
      form.value.avatar = file.content
      showToast('头像上传成功')
    }, 1000)
  }

  const onGenderConfirm = ({ selectedOptions }: any) => {
    form.value.gender = selectedOptions[0].value
    showGenderPicker.value = false
  }

  const onBirthdayConfirm = ({ selectedValues }: any) => {
    form.value.birthday = selectedValues.join('-')
    showBirthdayPicker.value = false
  }

  const onSubmit = async () => {
    loading.value = true
    try {
      const result = await userStore.updateUserInfo(form.value)
      if (result.success) {
        showToast('保存成功')
        router.go(-1)
      } else {
        showToast(result.message || '保存失败')
      }
    } catch (error) {
      console.error('保存失败:', error)
      showToast('保存失败，请重试')
    } finally {
      loading.value = false
    }
  }

  const goBack = () => {
    router.go(-1)
  }
</script>

<style scoped lang="scss">
  .user-profile-page {
    min-height: 100vh;
    background-color: #f7f8fa;

    .profile-form {
      .avatar-section {
        display: flex;
        align-items: center;
        padding: 20px 16px;
        background: white;
        margin-bottom: 8px;

        .avatar-label {
          font-size: 14px;
          color: #333;
          margin-right: 20px;
        }

        .van-uploader {
          display: flex;
          align-items: center;
          gap: 12px;

          .upload-hint {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 4px;
            font-size: 12px;
            color: #999;
          }
        }
      }

      .submit-button {
        margin: 40px 16px;
      }
    }
  }
</style>
