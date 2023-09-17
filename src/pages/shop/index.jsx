import React, { useEffect, useState } from 'react'
import Nav from '@/components/shop/Nav'
import Footer from '@/components/shop/Footer'
import StoreHeading from '@/components/shop/StoreHeading'
import Image from 'next/image'
import Link from 'next/link'
import Price from '@/components/shop/Price'
import http from '@/services/Api'

function ShopIndex() {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {

        (
            async () => {
                try {
                    const { data } = await http.get('/products/show');
                    setProducts(data);
                } catch (error) {
                    if (error.response && error.response.status === 404) {
                        setError('Products Not Found');
                        console.log(error);
                    }
                }

            }
        )();

    }, [])


    return (
        <div className="flex flex-col justify-between min-h-screen">
            <Nav />

            <main>
                <div className="mx-auto max-w-6xl">
                    <StoreHeading />
                    <div className="py-12 max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-8">
                        {products.map((p) => (
                            <React.Fragment key={p.id}>
                                <Link
                                    href={`/products/${p.id}`}
                                    passHref
                                >
                                    <div className="h-72 border-b-2 border-palette-lighter relative">
                                        <img
                                            src={p.image}
                                            alt={p.title}
                                            layout="fill"
                                            className="transform duration-500 ease-in-out hover:scale-110"
                                        />
                                    </div>
                                    <div className="h-48 relative">
                                        <div className="font-primary text-purple-700 text-2xl pt-4 px-4 font-semibold">
                                            {p.title}
                                        </div>
                                        <div className="text-lg text-gray-600 p-4 font-primary font-light">
                                            {p.description}
                                        </div>
                                        <div
                                            className="text-palette-dark font-primary font-medium text-base absolute bottom-0 right-0 mb-4 pl-8 pr-4 pb-1 pt-2 bg-palette-lighter 
                                    rounded-tl-sm triangle"
                                        >
                                            <Price
                                                currency="Rp"
                                                num={p.price}
                                                numSize="text-lg"
                                            />
                                        </div>
                                    </div>
                                </Link>
                            </React.Fragment>
                        ))}


                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}

export default ShopIndex
