import React from 'react'
import Image from 'next/image'

const blogPosts = [
    {
        id: 1,
        title: 'Blog Post 1',
        date: 'July 1, 2023',
        categories: 'Education',
        description:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed id ultricies nisi. Nullam bibendum consequat risus eget euismod.',
        image: 'https://via.placeholder.com/300',
        uploader: 'admin',
    },
    {
        id: 2,
        title: 'Blog Post 2',
        date: 'July 5, 2023',
        categories: 'Life Style',
        description:
            'Praesent pharetra nisl a augue malesuada, id ultrices lectus luctus. Vestibulum tincidunt efficitur mi, id malesuada eros fermentum vel.',
        image: 'https://via.placeholder.com/300',
        uploader: 'admin',
    },
];

const BlogPostHomeComponent = ({ title, date, categories, description, uploader, image }) => {
    return (
        <div className="mx-auto p-4 mb-4 bg-white shadow">
            <div className="flex items-center mb-2">
                <p className="text-gray-500">{date}</p>
                <span className="text-gray-500 mx-2">|</span>
                <p className="text-gray-500">{categories}</p>
            </div>
            <div className="flex flex-col md:flex-row items-start">
                <Image src={image} width={300} height={300} alt="Blog Post" className="w-full max-h-48 md:w-1/3 object-cover rounded-lg mr-4" />
                <div>
                    <h2 className="text-xl font-bold mb-2">{title}</h2>
                    <p className="mb-2">{description}</p>
                </div>
                <div className="text-gray-500 mt-auto md:ml-auto">{uploader}</div>
            </div>
        </div>
    )
}

export { BlogPostHomeComponent, blogPosts };