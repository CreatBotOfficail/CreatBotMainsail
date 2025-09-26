<template>
    <div class="logOut">
        <img class="outImg" src="../../public/img/icons/tuichu.png" @click="openMenu">
        <div class="menuBox" v-if="menuShow">
            <div class="menuItem" @click="changePassword">
                <span>{{ $t('loginText.editPassword') }}</span>
                <img src="../../public/img/icons/genggai.png" alt="">
            </div>
            <div class="menuItem" @click="goOut">
                <span>{{ $t('loginText.logOut') }}</span>
                <img src="../../public/img/icons/tuichumin.png" alt="">
            </div>
        </div>
        <v-dialog v-model="changePasswordDialog" max-width="500px">
            <template v-slot:activator="{ on, attrs }">
                <div v-bind="attrs" v-on="on"></div>
            </template>
            <v-card>
                <v-card-title class="headline"> {{ $t('loginText.editPassword') }}
                    <v-spacer></v-spacer>
                    <v-btn icon @click="changePasswordDialog = false">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-card-title>
                <v-card-text>
                    <v-text-field v-model="oldPassword" :label="$t('loginText.oldPassword')" type="password"
                        required></v-text-field>
                    <v-text-field v-model="newPassword" :label="$t('loginText.newPassword')" type="password"
                        required></v-text-field>
                    <v-text-field v-model="confirmNewPassword" :label="$t('loginText.confirmPassword')" type="password"
                        required></v-text-field>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn text @click="changePasswordDialog = false">{{ $t('JobQueue.Cancel') }}</v-btn>
                    <v-btn text color="primary"
                        @click="submitPasswordChange">{{ $t('PowerDeviceChangeDialog.Yes') }}</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            menuShow: false,
            changePasswordDialog: false,
            oldPassword: '',
            newPassword: '',
            confirmNewPassword: ''
        }
    },
    mounted() {
        document.addEventListener('click', this.handleClickOutside);
    },
    beforeDestroy() {
        document.removeEventListener('click', this.handleClickOutside);
    },
    methods: {
        openMenu() {
            this.menuShow = !this.menuShow;
        },
        handleClickOutside(e) {
            if (!this.menuShow) {
                return;
            }
            if (!e.target.closest('.logOut')) {
                this.menuShow = false;
            }
        },
        //点击打开修改密码弹窗
        changePassword() {
            this.changePasswordDialog = true;
        },
        //点击提交修改密码操作 如成功 刷新页面触发重新登录
        submitPasswordChange() {
            if (this.newPassword !== this.confirmNewPassword) {
                this.$toast.error('The passwords entered twice are inconsistent');
                return;
            }
            const passwordChangeData = {
                password: this.oldPassword,
                new_password: this.newPassword
            };
            this.$socket.emitAndWait('access.user.password', passwordChangeData).then((res) => {
                if (res.action == 'user_password_reset') {
                    this.$toast.success('Password reset successfully');
                    this.changePasswordDialog = false;
                    this.oldPassword = '';
                    this.newPassword = '';
                    this.confirmNewPassword = '';
                    window.location.reload();
                } else {
                    this.$toast.error(res.msg || 'password reset failure');
                }
            })
        },
        //点击执行退出登录,并刷新当前页面
        goOut() {
            this.$socket.emitAndWait('access.super_logout').then((res) => {
                window.location.reload();
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.logOut {
    position: relative;
}

.menuBox {
    width: fit-content;
    z-index: 999;
    background-color: #1e1e1e;
    position: absolute;
    top: 40px;
    right: 0px;

    .menuItem {
        //禁止当前文本换行
        white-space: nowrap;
        text-align: center;
        color: #fff;
        padding: 10px 20px;
        cursor: pointer;
        display: flex;
        font-size: 14px;
        align-items: center;
        justify-content: space-between;

        img {
            width: 14px;
            height: 14px;
            margin-left: 10px;
        }
    }
}

.outImg {
    width: 24px;
    height: 24px;
    margin-top: 4px;
    cursor: pointer;
}
</style>
