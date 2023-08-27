import React from 'react'
import { Disclosure, Menu } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Button } from "@material-tailwind/react"
const navigation = [
    { name: 'Home', href: '/', current: true },
    { name: 'About', href: '/about', current: false },
]

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function NavbarComponent() {
    const router = useRouter();

    return (
        <Disclosure as="nav" className="bg-navbargelap">
            {({ open }) => (
                <>
                    <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                        <div className="relative flex h-16 items-center justify-between">
                            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                                {/* Mobile menu button*/}
                                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                                    <span className="sr-only">Open main menu</span>
                                    {open ? (
                                        <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                                    ) : (
                                        <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                                    )}
                                </Disclosure.Button>
                            </div>
                            <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                                <div className="flex flex-shrink-0 items-center">
                                    {/* <Image
                    className="block h-8 w-auto lg:hidden"
                    src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                    alt="Your Company"
                    width={500} // Set the appropriate width for your image
                    height={500} // Set the appropriate height for your image
                  />
                  <Image
                    className="hidden h-8 w-auto lg:block"
                    src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                    alt="Your Company"
                    width={500} // Set the appropriate width for your image
                    height={500} // Set the appropriate height for your image
                  /> */}

                                </div>
                                <div className="hidden sm:ml-6 sm:block">
                                    <div className="flex space-x-4">
                                        {navigation.map((item) => (
                                            <Link
                                                key={item.name}
                                                href={item.href}
                                                className={classNames(
                                                    router.pathname === item.href
                                                        ? 'bg-indigo-400 text-white'
                                                        : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                                    'px-3 py-2 rounded-md text-sm font-medium'
                                                )}
                                                aria-current={item.current ? 'page' : undefined}
                                            >
                                                {item.name}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                                <div className="hidden sm:block">
                                    <Link href="/register">
                                        <Button
                                            className={classNames(
                                                'mr-2',
                                                router.pathname === '/register'
                                                    ? 'bg-indigo-400 text-white' // Apply red background and white text for the active page
                                                    : 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:opacity-90',
                                                'px-3 py-2 rounded-md text-sm font-medium'
                                            )}
                                            size="sm"
                                        >
                                            Sign Up
                                        </Button>
                                    </Link>
                                    <Link href="/login">
                                        <Button
                                            className={classNames(
                                                'mr-2',
                                                router.pathname === '/login'
                                                    ? 'bg-indigo-400 text-white' // Apply red background and white text for the active page
                                                    : 'bg-navbargelap to-purple-500 text-white hover:opacity-90',
                                                'px-3 py-2 rounded-md text-sm font-medium'
                                            )}
                                            size="sm"
                                            color="blue-gray"
                                        >
                                            Sign In
                                        </Button>
                                    </Link>
                                </div>
                                {/* Profile dropdown */}
                                <Menu as="div" className="relative ml-3">
                                    {/* Your profile dropdown content */}
                                </Menu>
                            </div>
                        </div>
                        {/* Mobile menu */}
                        <Disclosure.Panel className="sm:hidden">
                            <div className="space-y-1 px-2 pb-3 pt-2">
                                {navigation.map((item) => (
                                    <Disclosure.Button
                                        key={item.name}
                                        as="a"
                                        href={item.href}
                                        className=
                                        {classNames(
                                            router.pathname === item.href
                                                ? 'bg-indigo-400 text-white'
                                                : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                            'block rounded-md px-3 py-2 text-base font-medium'
                                        )}
                                        aria-current={item.current ? 'page' : undefined}
                                    >
                                        {item.name}
                                    </Disclosure.Button>
                                ))}
                                <Button className="block mt-4 w-full" variant="outlined" size="sm" color="blue-gray">
                                    Sign In
                                </Button>
                                <Button className="block mt-2 w-full" variant="gradient" size="sm">
                                    Sign Up
                                </Button>
                            </div>
                        </Disclosure.Panel>
                    </div>
                </>
            )}
        </Disclosure>
    )
}