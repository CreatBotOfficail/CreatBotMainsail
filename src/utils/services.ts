import axios from 'axios'
import Vue from 'vue'

let hostname: string | undefined;
let port: string | undefined;

(async () => {
    const base = import.meta.env.BASE_URL ?? '/';
    try {
        const res = await fetch(`${base}config.json`);
        const file = (await res.json()) as Record<string, unknown>;
        hostname = file.hostname as string;
        port = file.port as string;
    } catch (error) {
        console.error('获取配置文件时出错:', error);
    }
})();

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
