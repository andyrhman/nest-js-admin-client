import React from 'react';
import Image from 'next/image'

const SidebarComponent = () => {
    return (
        <div className="mx-auto p-4 mb-4 bg-white shadow">
            <h2 className="text-lg font-bold mb-2">Categories</h2>
            <ul className="grid grid-cols-3 gap-3">
                <li>Category 1</li>
                <li>Category 2</li>
                <li>Category 3</li>
                <li>Category 4</li>
                <li>Category 5</li>
                <li>Category 6</li>
                <li>Category 7</li>
                <li>Category 8</li>
                <li>Category 9</li>
            </ul>
            <h2 className="text-lg font-bold my-4">Posts You Might Like</h2>
            <ul className="space-y-4">
                <li>
                    <div>
                        <Image src="https://via.placeholder.com/150" width={150} height={150} alt="Post" className="w-full object-cover rounded-lg max-h-40" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold mb-2">Post 1</h3>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    </div>
                </li>
                <li>
                    <div>
                        <Image src="https://via.placeholder.com/150" width={150} height={150} alt="Post" className="w-full object-cover rounded-lg max-h-40" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold mb-2">Post 2</h3>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    </div>
                </li>
                <li>
                    <div>
                        <Image src="https://via.placeholder.com/150" width={150} height={150} alt="Post" className="w-full object-cover rounded-lg max-h-40" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold mb-2">Post 3</h3>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    </div>
                </li>
            </ul>
        </div>

    );
};

export default SidebarComponent