import React from 'react';
import Layout from '@/components/Layout'; // Your custom layout component
import '@/styles/globals.css'; // Your global CSS file
import { ToastContainer } from 'react-toastify';
import "@fortawesome/fontawesome-free/css/all.min.css";
import 'react-toastify/dist/ReactToastify.css';

function MyApp({ Component, pageProps }) {
    return (
        <Layout>
            <ToastContainer />
            <Component {...pageProps} />
        </Layout>
    );
}

export default MyApp;