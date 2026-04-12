<template>
  <div class="user-address-page">
    <van-nav-bar
      title="收货地址"
      left-text="返回"
      left-arrow
      @click-left="$router.back()"
      fixed
      placeholder
      safe-area-inset-top
    />

    <div class="address-list">
      <van-empty
        v-if="addressList.length === 0"
        image="https://fastly.jsdelivr.net/npm/@vant/assets/custom-empty-image.png"
        description="暂无收货地址"
      >
        <van-button round type="primary" class="add-button" @click="onAddAddress">
          添加地址
        </van-button>
      </van-empty>

      <van-swipe-cell v-for="address in addressList" :key="address.id">
        <div class="address-item" @click="onEditAddress(address)">
          <div class="address-header">
            <span class="name">{{ address.name }}</span>
            <span class="phone">{{ address.phone }}</span>
            <van-tag v-if="address.isDefault" type="primary" size="small">默认</van-tag>
          </div>
          <div class="address-content">
            {{ address.province }}{{ address.city }}{{ address.district }}{{ address.detail }}
          </div>
        </div>
        <template #right>
          <van-button
            square
            text="删除"
            type="danger"
            class="delete-button"
            @click="onDeleteAddress(address)"
          />
          <van-button
            square
            :text="address.isDefault ? '默认' : '设默认'"
            :type="address.isDefault ? 'primary' : 'default'"
            class="set-default-button"
            @click="onSetDefault(address)"
          />
        </template>
      </van-swipe-cell>
    </div>

    <div class="bottom-action">
      <van-button round type="primary" block @click="onAddAddress">
        <van-icon name="add" />
        添加收货地址
      </van-button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { showConfirmDialog, showToast } from 'vant'

  interface Address {
    id: string
    name: string
    phone: string
    province: string
    city: string
    district: string
    detail: string
    isDefault: boolean
  }

  const addressList = ref<Address[]>([
    {
      id: '1',
      name: '张三',
      phone: '13800138000',
      province: '北京市',
      city: '北京市',
      district: '朝阳区',
      detail: '建国路88号',
      isDefault: true,
    },
    {
      id: '2',
      name: '李四',
      phone: '13900139000',
      province: '上海市',
      city: '上海市',
      district: '浦东新区',
      detail: '陆家嘴环路100号',
      isDefault: false,
    },
  ])

  const onAddAddress = () => {
    showToast('添加地址功能开发中')
  }

  const onEditAddress = (address: Address) => {
    showToast(`编辑地址: ${address.name}`)
  }

  const onDeleteAddress = async (address: Address) => {
    try {
      await showConfirmDialog({
        title: '确认删除',
        message: `确定要删除 ${address.name} 的收货地址吗？`,
      })
      addressList.value = addressList.value.filter(item => item.id !== address.id)
      showToast('删除成功')
    } catch {
      // 用户取消
    }
  }

  const onSetDefault = (address: Address) => {
    if (address.isDefault) return

    addressList.value = addressList.value.map(item => ({
      ...item,
      isDefault: item.id === address.id,
    }))
    showToast('设置默认地址成功')
  }
</script>

<style lang="scss" scoped>
  .user-address-page {
    min-height: 100vh;
    background-color: var(--van-background-color);
    padding-bottom: 60px;

    .address-list {
      padding: 12px;

      .address-item {
        background: white;
        border-radius: 8px;
        padding: 16px;
        margin-bottom: 12px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

        .address-header {
          display: flex;
          align-items: center;
          margin-bottom: 8px;

          .name {
            font-size: 16px;
            font-weight: 500;
            margin-right: 12px;
          }

          .phone {
            font-size: 14px;
            color: var(--van-gray-6);
            margin-right: 12px;
          }
        }

        .address-content {
          font-size: 14px;
          line-height: 1.5;
          color: var(--van-gray-8);
        }
      }

      .delete-button {
        height: 100%;
        background-color: var(--van-red);
      }

      .set-default-button {
        height: 100%;
        background-color: var(--van-gray-3);
      }
    }

    .add-button {
      margin-top: 16px;
    }

    .bottom-action {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 12px;
      background: white;
      box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
    }
  }
</style>
