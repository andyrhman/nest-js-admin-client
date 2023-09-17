import { useState, useRef } from 'react'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import BackToProductButton from '@/components/shop/BackToProductButton'
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons'
import Price from '@/components/shop/Price'
import Nav from '@/components/shop/Nav'
import Footer from '@/components/shop/Footer'

const ProductPage = () => {
    // const [mainImg, setMainImg] = useState([])
    const ref = useRef()

    function scroll(scrollOffset) {
        ref.current.scrollLeft += scrollOffset
    }
    return (
        <div className="flex flex-col justify-between min-h-screen">
            <Nav />
            <main>
                <div className="min-h-screen py-12 sm:pt-20">
                    <div className="flex flex-col justify-center items-center md:flex-row md:items-start space-y-8 md:space-y-0 md:space-x-4 lg:space-x-8 max-w-6xl w-11/12 mx-auto">
                        <div className="w-full md:w-1/2 max-w-md border border-palette-lighter bg-white rounded shadow-lg">
                            <div className="relative h-96">
                                <Image
                                    src="https://via.placeholder.com/300"
                                    alt="Image"
                                    layout="fill"
                                    className="transform duration-500 ease-in-out hover:scale-105"
                                />
                            </div>
                            <div className="relative flex border-t border-palette-lighter">
                                <button
                                    aria-label="left-scroll"
                                    className="h-32 bg-palette-lighter hover:bg-palette-light  absolute left-0 z-10 opacity-75"
                                    onClick={() => scroll(-300)}
                                >
                                    <FontAwesomeIcon icon={faArrowLeft} className="w-3 mx-1 text-purple-700" />
                                </button>
                                <div
                                    ref={ref}
                                    // style={{ scrollBehavior: "smooth" }}
                                    className="flex space-x-1 w-full overflow-auto border-t border-palette-lighter"
                                >
                                    <button
                                        // key={index}
                                        className="relative w-40 h-32 flex-shrink-0 rounded-sm "
                                    // onClick={() => setMainImg(imgItem.node)}
                                    >
                                        <Image
                                            src="https://via.placeholder.com/300"
                                            alt="Image"
                                            layout="fill"
                                            className="transform duration-500 ease-in-out hover:scale-105"
                                        />
                                    </button>
                                    <button
                                        // key={index}
                                        className="relative w-40 h-32 flex-shrink-0 rounded-sm "
                                    // onClick={() => setMainImg(imgItem.node)}
                                    >
                                        <Image
                                            src="https://doggystickers.vercel.app/_next/image?url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F2800%2F2014%2Fproducts%2Fmockup-fc750eaa.jpg%3Fv%3D1616988549&w=1920&q=75"
                                            alt="Image"
                                            layout="fill"
                                            className="transform duration-500 ease-in-out hover:scale-105"
                                        />
                                    </button>
                                </div>
                                <button
                                    aria-label="right-scroll"
                                    className="h-32 bg-palette-lighter hover:bg-palette-light  absolute right-0 z-10 opacity-75"
                                    onClick={() => scroll(300)}
                                >
                                    <FontAwesomeIcon icon={faArrowRight} className="w-3 mx-1 text-purple-700" />
                                </button>
                            </div>
                        </div>
                        <div className="flex flex-col justify-between h-full w-full md:w-1/2 max-w-xs mx-auto space-y-4 min-h-128">
                            <BackToProductButton />

                            <div className="font-primary">
                                <h1 className="leading-relaxed font-extrabold text-3xl text-purple-700 py-2 sm:py-4">
                                    "123"
                                </h1>
                                <p className="font-medium text-lg">
                                    "Test"
                                </p>
                                <div className="text-xl text-purple-700 font-medium py-4 px-1">
                                    <Price
                                        currency="$"
                                        num="200"
                                        numSize="text-2xl"
                                    />
                                </div>
                            </div>

                            <div className="w-full">
                                <div className="flex justify-start space-x-2 w-full">
                                    <div className="flex flex-col items-start space-y-1 flex-grow-0">
                                        <label className="text-gray-500 text-base">Qty.</label>
                                        <input
                                            type="number"
                                            inputMode="numeric"
                                            id="quantity"
                                            name="quantity"
                                            min="1"
                                            step="1"
                                            value="1"
                                            // value={quantity}
                                            // onChange={(e) => updateQuantity(e.target.value)}
                                            className="text-gray-900 form-input border border-gray-300 w-16 rounded-sm focus:border-palette-light focus:ring-palette-light"
                                        />
                                    </div>
                                    <div className="flex flex-col items-start space-y-1 flex-grow">
                                        <label className="text-gray-500 text-base">Size</label>
                                        <select
                                            id="size-selector"
                                            name="size-selector"
                                            // onChange={(event) => handleSizeChange(event.target.value)}
                                            // value={variantId}
                                            className="form-select border border-gray-300 rounded-sm w-full text-gray-900 focus:border-palette-light focus:ring-palette-light"
                                        >
                                            <option
                                                value="3 x 3"
                                            >
                                                3 x 3
                                            </option>
                                            <option
                                                value="4 x 3"
                                            >
                                                4 x 3
                                            </option>
                                            <option
                                                value="5 x 5"
                                            >
                                                5 x 5
                                            </option>
                                        </select>
                                    </div>
                                </div>
                                <button
                                    className="pt-3 pb-2 bg-purple-700 text-white w-full mt-2 rounded-sm font-primary font-semibold text-xl flex 
            justify-center items-baseline  hover:bg-palette-dark"
                                    aria-label="cart-button"
                                >
                                    Add To Cart
                                    <FontAwesomeIcon icon={faShoppingCart} className="w-5 ml-2" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>

    )
}

export default ProductPage;