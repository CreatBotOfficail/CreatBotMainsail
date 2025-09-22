<template>
    <div class="logOut">
        <img class="outImg" src="../../public/img/icons/tuichu.png" @click="openMenu">

        <div class="menuBox" v-if="menuShow">
            <div class="menuItem" @click="changePassword">
                <span>修改密码</span>
                <img src="../../public/img/icons/genggai.png" alt="">
            </div>
            <div class="menuItem" @click="goOut">
                <span>退出登录</span>
                <img src="../../public/img/icons/tuichumin.png" alt="">
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            menuShow: false
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
            console.log('触发点击');
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


        changePassword() {
            // 跳转到修改密码页面
            this.$router.push('/changePassword');
        },
        goOut() {
            this.$socket.emitAndWait('access.super_logout').then((res) => {
                //刷新当前页面
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
    width: 150px;
    z-index: 999;
    background-color: #1e1e1e;
    position: absolute;
    top: 40px;
    right: 0px;

    .menuItem {
        width: 100%;
        text-align: center;
        color: #fff;
        padding: 10px 20px;
        cursor: pointer;
        display: flex;
        font-size: 14px;
        align-items: center;
        justify-content: center;
        padding: 10px 0;

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
