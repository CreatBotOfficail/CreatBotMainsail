<template>
    <v-dialog ref="openDialog" v-model="$store.state.server.isLogin" persistent :width="450">
        <panel :title="$t('loginText.tip')" card-class="the-connection-dialog" :margin-bottom="false">
            <v-card-text class="pt-5">
                <v-text-field v-model="password" :label="$t('loginText.passwordPlaceholder')" type="password"
                    :placeholder="$t('loginText.passwordPlaceholder')"></v-text-field>
            </v-card-text>
            <v-card-actions class="justify-center">
                <v-btn class="black" @click="goSocketLogin()" variant="tonal">{{ $t('loginText.login') }}</v-btn>
            </v-card-actions>
        </panel>
    </v-dialog>
</template>

<script lang="ts">
import BaseMixin from '@/components/mixins/base';
import ThemeMixin from '@/components/mixins/theme';
import Vue from 'vue'
import { Component, Vue as VueClass } from 'vue-property-decorator';  // 引入 Vue 组件装饰器

// 检查是否已注入 $t 方法
function checkI18nInjection(vm: Vue) {
  if (!vm.$t) {
    console.error('i18n 未正确注入，$t 方法不存在。请检查 i18n 插件是否已正确安装和配置。');
  }
}

// 假设原代码是基于选项式 API，这里为了确保 i18n 生效，添加 i18n 相关逻辑
@Component
export default class LoginDialog extends VueClass {
    mixins: [BaseMixin, ThemeMixin]
    counter: number = 0
    password: string = '123456'

    created() {
        checkI18nInjection(this);  // 在组件创建时检查 i18n 是否注入
    }

    //使用 websock 发起登录请求
    goSocketLogin() {
        const loginData = { password: this.password };
        Vue.$socket.emitAndWait('access.super_login', loginData).then((res) => {
            if(res.action === "trusted_user_super_login"){
                window.location.reload();
            }
        }).catch((error) => {
            console.error('登录请求出错:', error);
        });
    }
}
</script>
