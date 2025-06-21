import axios from 'axios'
import Vue from 'vue'

const hostname = (import.meta.env.VUE_APP_HOSTNAME as string) || window.location.hostname
const defaultPort = window.location.port || (window.location.protocol === 'https:' ? 443 : 80)
const port = import.meta.env.VUE_APP_PORT ? Number(import.meta.env.VUE_APP_PORT) : Number(defaultPort)

// 创建 axios 实例
const service = axios.create({
    baseURL: `http://${hostname}:${port}`,
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
        const res = response
        return res
    },
    error => {
        if (error.response) {
            const { status, statusText } = error.response;
            if (status === 401) { localStorage.removeItem('token'); window.location.reload(); return Promise.reject(error.response.data); }
            const errorMsg = error.code === 'ECONNABORTED' && error.message.includes('timeout') ? 'Request timed out. Please refresh and try again' : statusText;
            Vue.prototype.$toast.error(errorMsg, { position: 'top' });
            return Promise.reject(error.response.data);
        } else {
            return Promise.reject(error);
        }
    }
)

export default service
