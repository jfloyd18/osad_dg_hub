import axios from 'axios';
window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

/**
 * This is the crucial line that enables API authentication.
 * It tells Axios to send cookies with every request.
 */
window.axios.defaults.withCredentials = true;