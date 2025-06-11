import axios from 'axios'
import Vue from 'vue'
import { VSnackbar } from 'vuetify/lib'

// 创建 axios 实例
const service = axios.create({
    baseURL: 'http://d600pro2hs-d7e7.lan:7125',
    // baseURL: process.env.VUE_APP_BASE_API, // 从环境变量获取基础URL
    timeout: 10000 // 请求超时时间
})

// 请求拦截器
service.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token')
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`,
                config.headers['Content-Type'] = 'application/json'
        }
        return config
    },
    error => {
        Vue.prototype.$loading.hide()
        return Promise.reject(error)
    }
)
service.interceptors.response.use(
    response => {
        const res = response.data
        return res
    },
    error => {
        let message = ''
        if (error.response) {
            message = error.response.statusText
            Vue.prototype.$toast.error(message, {
                position: 'top'
            });
            return Promise.reject(error.response.data)
        } else {
            message = error.message
        }
        if (error.code === 'ECONNABORTED' && error.message.includes('timeout')) {
            Vue.prototype.$toast.error('Request timed out. Please refresh and try again', {
                position: 'top'
            });
        }
        return Promise.reject(error);
    }
)

export default service
