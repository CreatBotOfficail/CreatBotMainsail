<template>
    <v-dialog ref="openDialog" v-model="$store.state.server.isLogin" persistent :width="450">
        <panel :title="`You need to log in first`" card-class="the-connection-dialog" :margin-bottom="false">
            <v-card-text class="pt-5">
                <!-- <v-text-field v-model="username" label="account" placeholder="Please enter account name"></v-text-field> -->
                <v-text-field v-model="password" label="password" type="password"
                    placeholder="please enter the password"></v-text-field>
            </v-card-text>
            <v-card-actions class="justify-center">
                <v-btn class="black" ton @click="goSocketLogin()" variant="tonal">login</v-btn>
            </v-card-actions>
        </panel>
    </v-dialog>
</template>

<script lang="ts">
import BaseMixin from '@/components/mixins/base';
import ThemeMixin from '@/components/mixins/theme';
import Vue from 'vue'

export default {
    mixins: [BaseMixin, ThemeMixin],
    data() {
        return {
            counter: 0,
            // username: 'my_user',
            password: 'admin',
            // source: 'moonraker'
        };
    },
    created() {

    },
    methods: {
        //使用websock 发起登录请求
        goSocketLogin() {
            const loginData = { password: this.password };
            Vue.$socket.emitAndWait('access.super_login', loginData).then((res) => {
             window.location.reload();
            })
        }
    }
};
</script>
