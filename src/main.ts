import 'regenerator-runtime' // async polyfill used by the gcodeviewer
import 'resize-observer-polyfill' // polyfill needed by the responsive class detection
import Vue from 'vue'
import App from '@/App.vue'
import vuetify from '@/plugins/vuetify'
import i18n, { setAndLoadLocale } from '@/plugins/i18n'
import store from '@/store'
import router from '@/plugins/router'
import { WebSocketPlugin } from '@/plugins/webSocketClient'
// vue-observe-visibility
import { ObserveVisibility } from 'vue-observe-visibility'
//vue-meta
import VueMeta from 'vue-meta'
//vue-load-image
import VueLoadImage from 'vue-load-image'
//vue-toast-notifications
import VueToast from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-sugar.css'
//overlayerscrollbars-vue
import { OverlayScrollbarsPlugin } from 'overlayscrollbars-vue'
import 'overlayscrollbars/css/OverlayScrollbars.css'
// Directives
import './directives/longpress'
import './directives/responsive-class'

// Echarts
import ECharts from 'vue-echarts'
import { use } from 'echarts/core'

// import ECharts modules manually to reduce bundle size
import { SVGRenderer } from 'echarts/renderers'
import { BarChart, LineChart, PieChart } from 'echarts/charts'
import { DatasetComponent, GridComponent, LegendComponent, TooltipComponent } from 'echarts/components'
// vue-resize
import 'vue-resize/dist/vue-resize.css'
// @ts-ignore
import VueResize from 'vue-resize'
import { defaultMode } from './store/variables'


import axios from 'axios'
import services from '@/utils/services'
import { getDownloadLog,getDownloadZip} from '@/utils/tool'

Vue.prototype.$services = services
Vue.prototype.$getDownloadLog = getDownloadLog
Vue.prototype.$getDownloadZip = getDownloadZip

Vue.config.productionTip = false

Vue.directive('observe-visibility', ObserveVisibility)

Vue.use(VueMeta)

Vue.component('VueLoadImage', VueLoadImage)

Vue.use(VueToast, {
    duration: 3000,
})

axios.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token && !config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

const originalFetch = window.fetch;
window.fetch = async function (url, options: RequestInit = {}) {
    try {
        const token = localStorage.getItem('token');
        if (token) {
            if (!options.headers) {
                options.headers = new Headers();
            }
            if (options.headers instanceof Headers) {
                options.headers.set('Authorization', `Bearer ${token}`);
            } else if (typeof options.headers === 'object' && !Array.isArray(options.headers)) {
                (options.headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
            } else {
                const newHeaders = new Headers();
                if (Array.isArray(options.headers)) {
                    options.headers.forEach(([key, value]) => newHeaders.set(key, value));
                } else {
                    Object.entries(options.headers as Record<string, string>).forEach(([key, value]) => newHeaders.set(key, value));
                }
                newHeaders.set('Authorization', `Bearer ${token}`);
                options.headers = newHeaders;
            }
        }
        const response = await originalFetch.call(window, url, options);
        return response;
    } catch (error) {
        console.error('Fetch error:', error);
        return Promise.reject(error);
    }
};

const isSafari = navigator.userAgent.includes('Safari') && navigator.userAgent.search('Chrome') === -1
const isTouch = 'ontouchstart' in window || (navigator.maxTouchPoints > 0 && navigator.maxTouchPoints !== 256)
Vue.use(OverlayScrollbarsPlugin, {
    className: 'os-theme-light',
    scrollbars: {
        visibility: 'auto',
        autoHide: isSafari && isTouch ? 'scroll' : 'move',
    },
})

use([SVGRenderer, LineChart, BarChart, LegendComponent, PieChart, DatasetComponent, GridComponent, TooltipComponent])
Vue.component('EChart', ECharts)

Vue.use(VueResize)

const initLoad = async () => {
    try {
        // get base url. by default, it is '/'
        const base = import.meta.env.BASE_URL ?? '/'

        //load config.json
        const res = await fetch(`${base}config.json`)
        const file = (await res.json()) as Record<string, unknown>

        window.console.debug('Loaded config.json')

        await store.dispatch('importConfigJson', file)
        const locale = (file.defaultLocale ?? 'en') as string
        await setAndLoadLocale(locale)

        // Handle mode outside store init and before vue mount for consistency in dialog
        const mode = file.defaultMode ?? defaultMode
        vuetify.framework.theme.dark = mode !== 'light'
    } catch (e) {
        window.console.error('Failed to load config.json')
        window.console.error(e)
    }
}

initLoad().then(() =>
    new Vue({
        vuetify,
        router,
        store,
        i18n,
        mounted() {
            const url = this.$store.getters['socket/getWebsocketUrl'];
            Vue.use(WebSocketPlugin, { url: url, store: this.$store });
            if (this.$store?.state?.instancesDB === 'moonraker') {
                Vue.$socket.connect();
            }
        },
        render: (h) => h(App),
    }).$mount('#app')
)
