<template>
    <v-dialog ref="openDialog" v-model="showDialog" persistent :width="450">
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
            showDialog: false,
            counter: 0,
            username: 'my_user',
            password: 'my_password',
            source: 'moonraker'
        };
    },
    created() {

    },
    methods: {
        //使用websock 发起登录请求
        goSocketLogin() {
            const loginData = { username: this.username, password: this.password, source: 'moonraker' };
            Vue.$socket.emitAndWait('access.login', loginData)
                .then(({ token }) => {
                    if (token) {
                        this.$toast.success('login is successful', { position: 'top' });
                        localStorage.setItem('token', token);
                        window.location.reload();
                    }
                })
                .catch(() => {
                    this.showDialog = true;
                    this.$toast.error('login failed', { position: 'top' });
                });
        },

        goLogin() {
            const data = {
                username: this.username,
                password: this.password,
                source: this.source
            };
            this.$services.post('/access/login', data).then((res) => {
                if (res.result.token) {
                    localStorage.setItem('token', res.result.token);
                    this.showDialog = false;
                    window.location.reload()
                    this.$toast.success('login is successful', {
                        position: 'top'
                    });
                } else {
                    this.$toast.error('login failed', {
                        position: 'top'
                    });
                    this.showDialog = true;
                }
            });
        },
    }
};
</script>
