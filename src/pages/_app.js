import React from 'react';
import Layout from '@/components/Layout'; // Your custom layout component
import '@/styles/globals.css'; // Your global CSS file
import { ToastContainer } from 'react-toastify';
import "@fortawesome/fontawesome-free/css/all.min.css";
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { configStore } from '@/redux/configureStore';
import { Provider } from 'react-redux';

axios.defaults.baseURL = 'http://localhost:8000/api/';
axios.defaults.withCredentials = true;

const store = configStore();

function MyApp({ Component, pageProps }) {
    return (
        <Layout>
            <Provider store={store}>
                <ToastContainer />
                <Component {...pageProps} />
            </Provider>
        </Layout>
    );
}

export default MyApp;