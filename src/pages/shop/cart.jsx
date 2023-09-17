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
                <tr className="text-sm sm:text-base text-gray-600 text-center">
                  <td className="font-primary font-medium px-4 sm:px-6 py-4 flex items-center">
                    <img
                      src="https://doggystickers.vercel.app/_next/image?url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F2800%2F2014%2Fproducts%2Fmockup-fc750eaa.jpg%3Fv%3D1616988549&w=1920&q=75"
                      alt="Image"
                      height={64}
                      width={64}
                      className={`hidden sm:inline-flex`}
                    />
                    <Link
                      passHref
                      href={`/products/123`}
                      className="pt-1 hover:text-palette-dark"
                    >
                      Test, 2 x 3
                    </Link>
                  </td>
                  <td className="font-primary font-medium px-4 sm:px-6 py-4">
                    <input
                      type="number"
                      inputMode="numeric"
                      id="variant-quantity"
                      name="variant-quantity"
                      min="1"
                      step="1"
                      // value={item.variantQuantity}
                      // onChange={(e) => updateItem(item.variantId, e.target.value)}
                      className="text-gray-900 form-input border border-gray-300 w-16 rounded-sm focus:border-palette-light focus:ring-palette-light"
                    />
                  </td>
                  <td className="font-primary text-base font-light px-4 sm:px-6 py-4 hidden sm:table-cell">
                    <Price
                      currency="$"
                      num="200"
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
                <tr className="text-center">
                  <td></td>
                  <td className="font-primary text-base text-gray-600 font-semibold uppercase px-4 sm:px-6 py-4">Subtotal</td>
                  <td className="font-primary text-lg text-purple-700 font-medium px-4 sm:px-6 py-4">
                    <Price
                      currency="$"
                      num={200}
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
