import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'
import Price from '@/components/shop/Price'
import Nav from '@/components/shop/Nav'
import Footer from '@/components/shop/Footer'
import CheckOutButton from '@/components/shop/CheckOutButton'
import PageTitle from '@/components/shop/PageTitle'
import BackToProductButton from '@/components/shop/BackToProductButton'

function CartPage() {

  const [orderItem, setOrderItem] = useState([])
  const [total, setTotal] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {

    (
      async () => {
        try {
          const { data } = await axios.get('order-user')
          setOrderItem(data.order_items)
          setTotal(data.total)
        } catch (error) {
          if (error.response && error.response.status === 400) {
            setError('Products Not Found');
          }
        }
      }
    )();
  }, [])

  return (
    <div className="flex flex-col justify-between min-h-screen">
      <Nav />
      <main>
        <div className="container mx-auto mb-20 min-h-screen">
          <PageTitle text="Your Cart" />

          <div className="min-h-80 max-w-2xl my-4 sm:my-8 mx-auto w-full">
            <table className="mx-auto">
              <thead>
                <tr className="uppercase text-xs sm:text-sm text-purple-700 border-b border-palette-light">
                  <th className="font-primary font-normal px-6 py-4">Product</th>
                  <th className="font-primary font-normal px-6 py-4">Quantity</th>
                  <th className="font-primary font-normal px-6 py-4 hidden sm:table-cell">Price</th>
                  <th className="font-primary font-normal px-6 py-4">Remove</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-palette-lighter">

                {orderItem?.map((o) => (
                  <tr className="text-sm sm:text-base text-gray-600 text-center" key={o.id}>
                    <td className="font-primary font-medium px-4 sm:px-6 py-4 flex items-center">
                      <img
                        src={o.product.image}
                        alt="Image"
                        height={64}
                        width={64}
                        className={`hidden sm:inline-flex`}
                      />
                      <Link
                        passHref
                        href={`/shop/products/${o.product.slug}`}
                        className="pt-1 hover:text-palette-dark"
                      >
                        {o.product_title}
                      </Link>
                    </td>
                    <td className="font-primary font-medium px-4 sm:px-6 py-4">
                      <input
                        type="number"
                        inputMode="numeric"
                        name="variant-quantity"
                        min="1"
                        step="1"
                        defaultValue={o.quantity}
                        className="text-gray-900 form-input border border-gray-300 w-16 rounded-sm focus:border-palette-light focus:ring-palette-light"
                      />
                    </td>
                    <td className="font-primary text-base font-light px-4 sm:px-6 py-4 hidden sm:table-cell">
                      <Price
                        currency="$"
                        num={o.price}
                        numSize="text-lg"
                      />
                    </td>
                    <td className="font-primary font-medium px-4 sm:px-6 py-4">
                      <button
                        aria-label="delete-item"
                        className=""
                      // onClick={() => updateItem(item.variantId, 0)}
                      >
                        <FontAwesomeIcon icon={faTimes} className="w-8 h-8 text-purple-700 border border-purple-700 p-1 hover:bg-palette-lighter" />
                      </button>
                    </td>
                  </tr>
                ))}

                <tr className="text-center">
                  <td></td>
                  <td className="font-primary text-base text-gray-600 font-semibold uppercase px-4 sm:px-6 py-4">Subtotal</td>
                  <td className="font-primary text-lg text-purple-700 font-medium px-4 sm:px-6 py-4">
                    <Price
                      currency="$"
                      num={total}
                      numSize="text-xl"
                    />
                  </td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="max-w-sm mx-auto space-y-4 px-2">
            <CheckOutButton />
            <BackToProductButton />
          </div>
        </div>
      </main>
      <Footer />
    </div>



  )
}

export default CartPage
