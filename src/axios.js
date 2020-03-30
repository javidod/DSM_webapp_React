import axios from 'axios';

const instance = axios.create({
    //baseURL: 'https://my-demoblog.firebaseio.com'
    baseURL: 'https://fir-javier.firebaseio.com/'  
});

export default instance;