<template>
  <div class="test-page">
    <div class="title">Test</div>
    <div class="row">
      <div class="sub-title">cookie</div>
      <div class="sub-content">
        <div class="li" v-for="key in cookie">{{ key }}: {{ getCookie(key) }}</div>
      </div>
    </div>
    <div class="row">
      <div class="sub-title">jsBridge</div>
      <div class="sub-content">
        <button @click="emitEvent('generalRouteJump', { jumpUrl: 'https://www.bilibili.com' })">
          跳转
        </button>
        <button @click="emitEvent('closePage', {})">关闭页面</button>
        <button @click="emitEvent('getUserToken')">获取token</button>
      </div>
      <div class="sub-content">
        <div class="li">事件: <input type="text" v-model="eventName" /></div>
        <div class="li">参数: <input type="text" v-model="eventParams" /></div>
        <div class="li">
          <button @click="emitEvent(eventName, eventParams)">触发事件</button>
          <button @click="clearEmit">清空结果</button>
        </div>
        <div class="li">
          返回打印：
          <div>{{ eventResult }}</div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="sub-title">api</div>
      <div class="sub-content">
        <div class="li">请求类型: <input type="text" v-model="apiType" /></div>
        <div class="li">接口路径: <input type="text" v-model="apiName" /></div>
        <div class="li">参数: <input type="text" v-model="apiParams" /></div>
        <div class="li">
          <button @click="apiEvent">触发事件</button>
          <button @click="clearApi">清空结果</button>
        </div>
        <div class="li">
          返回打印：
          <div>{{ apiResult }}</div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="sub-title">游客登陆</div>
      <div class="sub-content">
        <div class="li">authToken: <input type="text" v-model="authToken" /></div>
        <div class="li">
          <button @click="login">游客登陆</button>
        </div>
        <div class="li">
          游客token：
          <div>{{ token }}</div>
        </div>
      </div>
    </div>
    <div>
      <img :src="getImageUrl('1')">
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { cookieKeys, getCookie } from 'UTILS/cookies';
import { apiGet, apiPost } from 'UTILS/axios';
import { apiAccess } from 'API/account';

const cookie = cookieKeys();

const getImageUrl = (path: string) => {
  return `../assets/images/${path}.png`;
}

// 交互测试
const eventName = ref();
const eventParams = ref();
const eventResult = ref('');
const emitEvent = (event?: string, params?: Record<string, string>) => {
  if (!event) {
    return;
  }
  console.log('触发事件', event, params);
  window.jsClientBridge?.[event!]?.(params, (res: any) => {
    console.log('交互回调', res);
    eventResult.value = res;
  });
};
const clearEmit = () => {
  eventResult.value = '';
};

// 接口测试
const apiType = ref('get');
const apiName = ref('gift/getBigEmojiList');
const apiParams = ref('{}');
const apiResult = ref('');
const apiEvent = () => {
  if (!apiName.value) {
    return;
  }
  if (apiType.value === 'get') {
    apiGet(apiName.value, JSON.parse(apiParams.value)).then((res: any) => {
      console.log('接口回调', res);
      apiResult.value = res;
    });
  } else if (apiType.value === 'post') {
    apiPost(apiName.value, JSON.parse(apiParams.value)).then((res: any) => {
      console.log('接口回调', res);
      apiResult.value = res;
    });
  }
};
const clearApi = () => {
  apiResult.value = '';
};

const token = ref('');
const authToken = ref('BP3A.251105.015');
/** 游客登陆 */
const login = () => {
  apiAccess({ authToken: authToken.value, loginMethod: 4 }).then(res => {
    console.log(res);
    token.value = res.token;
  });
};
</script>
<style scoped lang="scss">
.test-page {
  width: 100%;
  height: 100%;
  padding: 50px 0;
  .title {
    font-size: 50px;
    font-weight: 600;
    text-align: center;
    line-height: 60px;
  }
  .row {
    padding: 0 24px;
    margin-bottom: 50px;
    .sub-title {
      font-size: 30px;
      font-weight: 600;
    }
    .sub-content {
      word-break: break-all;
      button {
        padding: 10px 20px;
        border: 1px solid #000000;
        border-radius: 8px;
        &:not(:last-child) {
          margin-right: 20px;
        }
        &:active {
          background-color: #666;
          color: #ffffff;
        }
      }
      input {
        border: 1px solid #000000;
        padding: 0 20px;
      }
      .li:not(:last-child) {
        margin-bottom: 20px;
      }
    }
  }
}
</style>
