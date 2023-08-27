// pages/index.js
import React from 'react';
import Head from 'next/head';
import Layout from '@/components/Layout'; // Import the custom Layout component
import NavbarComponent from '@/components/NavbarComponent'
import SidebarComponent from '@/components/SidebarComponent';
import { BlogPostHomeComponent, blogPosts } from '@/components/BlogPostHomeComponent';

function HomePage() {
    return (
        <Layout> {/* Wrap the content with the custom Layout component */}
            <Head>
                <title>Blog | Home </title>
                <meta name="description" content="Welcome to my website" />
            </Head>
            {/* Your existing content */}
            <NavbarComponent />
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                <div className="flex flex-col md:flex-row justify-between">
                    <div className="w-full md:w-3/4 md:mr-8">
                        {blogPosts.map((post) => (
                            <BlogPostHomeComponent
                                key={post.id}
                                title={post.title}
                                date={post.date}
                                description={post.description}
                                image={post.image}
                                categories={post.categories}
                                uploader={post.uploader}
                            />
                        ))}
                    </div>
                    <div className="w-full md:w-1/4 mt-8 md:mt-0">
                        <SidebarComponent />
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default HomePage;