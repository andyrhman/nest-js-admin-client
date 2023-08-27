import React from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';
import NavbarComponent from '../components/NavbarComponent';

const AboutPage = () => {
	return (
		<Layout>
			<div>
				<Head>
					<title>My Website | About</title>
					<meta name="description" content="Welcome to my website" />
				</Head>
				{/* Your other page content */}
				<NavbarComponent />
				<h1>hello</h1>
			</div>
		</Layout>
	);
};

export default AboutPage;