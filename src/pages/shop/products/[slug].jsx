import { useState, useRef, useEffect } from 'react'
import http from '@/services/Api'
import { useRouter } from 'next/router'

// * Components
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons'

// * Layouts
import BackToProductButton from '@/components/shop/BackToProductButton'
import Price from '@/components/shop/Price'
import Nav from '@/components/shop/Nav'
import Footer from '@/components/shop/Footer'

const ProductPage = () => {
    const [id, setId] = useState('');
    const [showId, setShowId] = useState(false)
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState('');
    const [price, setPrice] = useState('');
    const [multipleImg, setMultipleImg] = useState([]);

    const ref = useRef()

    function scroll(scrollOffset) {
        ref.current.scrollLeft += scrollOffset
    }

    const [error, setError] = useState('');

    const router = useRouter();
    const { slug } = router.query;
    useEffect(() => {
        if (slug) {
            (
                async () => {
                    try {
                        const { data } = await http.get(`/products/${slug}`);

                        setId(data.id);
                        setTitle(data.title);
                        setDescription(data.description);
                        setImage(data.image);
                        setPrice(data.price);
                        setMultipleImg(data.product_images);
                    } catch (error) {
                        if (error.response && error.response.status === 401) {
                            setError('An error occurred');
                            router.push('/login');
                        }

                        if (error.response && error.response.status === 403) {
                            setError('An error occurred');
                            router.push('/login');
                        }
                    }

                }
            )()
        }

    }, [slug]);

    const [quantity, setQuantity] = useState('');

    const submit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const { data } = await http.post('/products/order-products', {
                id,
                quantity
            });

            console.log(data);

        } catch (error) {
            console.error(error.response);

            if (error.response && error.response.data && error.response.data.message) {
                const errorMessage = error.response.data.message;
                setError(errorMessage);
            }
            if (error.response && error.response.status === 401) {
                setError('Please login to order the product');
                router.push('/login');
            }


        }
    }

    return (
        <div className="flex flex-col justify-between min-h-screen">
            <Nav />
            <main>
                <div className="min-h-screen py-12 sm:pt-20">
                    <div className="flex flex-col justify-center items-center md:flex-row md:items-start space-y-8 md:space-y-0 md:space-x-4 lg:space-x-8 max-w-6xl w-11/12 mx-auto">
                        <div className="w-full md:w-1/2 max-w-md border border-palette-lighter bg-white rounded shadow-lg">
                            <div className="relative h-96">
                                <img
                                    src={image}
                                    alt={title}
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
                                    style={{ scrollBehavior: "smooth" }}
                                    className="flex space-x-1 w-full overflow-auto border-t border-palette-lighter"
                                >
                                    {multipleImg.map((i) => (
                                        <button
                                            key={i.id}
                                            className="relative w-40 h-32 flex-shrink-0 rounded-sm "
                                            onClick={() => setImage(i.image)}
                                        >
                                            <img
                                                src={i.image}
                                                alt="Image"
                                                layout="fill"
                                                className="transform duration-500 ease-in-out hover:scale-105"
                                            />
                                        </button>
                                    ))}


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
                                    {title}
                                </h1>
                                <p className="font-medium text-lg">
                                    {description}
                                </p>
                                <div className="text-xl text-purple-700 font-medium py-4 px-1">
                                    <Price
                                        currency="$"
                                        num={price}
                                        numSize="text-2xl"
                                    />
                                </div>
                            </div>

                            <div className="w-full">
                                <form onSubmit={submit}>
                                    <div className="flex justify-start space-x-2 w-full">

                                        <div className="flex flex-col items-start space-y-1 flex-grow-0">
                                            <label className="text-gray-500 text-base">Qty.</label>
                                            <input
                                                type="number"
                                                name="quantity"
                                                min="1"
                                                max="1"
                                                onChange={(e) => setQuantity(e.target.value)}
                                                className="text-gray-900 form-input border border-gray-300 w-16 rounded-sm focus:border-palette-light focus:ring-palette-light"
                                            />
                                            {error && <div className="text-red-500 text-xs mt-1">{error}</div>}
                                        </div>
                                        {showId &&
                                            <input
                                                type="text"
                                                value={id}
                                                onChange={(e) => setId(e.target.value)}
                                            />
                                        }
                                    </div>
                                    <button
                                        className="pt-3 pb-2 bg-purple-700 text-white w-full mt-2 rounded-sm font-primary font-semibold text-xl flex 
            justify-center items-baseline  hover:bg-palette-dark"
                                        aria-label="cart-button"
                                    >
                                        Add To Cart
                                        <FontAwesomeIcon icon={faShoppingCart} className="w-5 ml-2" />
                                    </button>
                                </form>
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