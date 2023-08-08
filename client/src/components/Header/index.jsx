import { Fragment, useEffect, useState } from 'react';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import logo from "../../assets/logo.png";
import avatar from "../../assets/avatar.webp";
import { Link } from 'react-router-dom';
import AuthService from '../../utils/auth';

function AuthenticatedNav() {
    return (
        <Link
            to="#"
            onClick={() => {
                AuthService.logout();
                alert("You have been logged out");
            }}
            className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
        >
            Logout
        </Link>
    );
}

function UnauthenticatedNav() {
    return (
        <>
            <Link to="/signup" className="rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white">
                Create Account
            </Link>
            <Link
                to="/login"
                className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
            >
                Login
            </Link>
        </>
    );
}

export default function Navbar() {
    const isAuthenticated = AuthService.loggedIn();
    const [logged, setLogged] = useState(AuthService.loggedIn());

    useEffect(() => {
        const checkAuthStatus = () => {
            const currentStatus = AuthService.loggedIn();
            if (logged !== currentStatus) {
                setLogged(currentStatus);
            }
        };

        const intervalId = setInterval(checkAuthStatus, 1000);

        return () => {
            clearInterval(intervalId);
        };
    }, [logged]);

    return (
        <Disclosure as="nav" className="bg-green-800" style={{ boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)" }}>
            {({ open }) => (
                <>
                    {/* Main Navbar Content */}
                    <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-8">
                        <div className="relative flex h-16 items-center justify-between">

                            {/* Logo and Search Section */}
                            <div className="flex items-center px-2 lg:px-0">
                                <div className="flex-shrink-0 pt-12">
                                    <div className="flex overflow-hidden items-center justify-center rounded-full h-28 w-28 bg-white shadow-md">
                                        <Link to='/'>
                                            <img className="h-28 -mt-4 w-auto" src={logo} alt="NutureNavigator" />
                                        </Link>
                                    </div>
                                    {logged && (
                                        <Menu as="div" className="relative ml-4 flex-shrink-0">
                                            <div>
                                                <Menu.Button className="rounded-full">
                                                    <img className="h-8 w-8 rounded-full" src={avatar} alt="" />
                                                </Menu.Button>
                                            </div>
                                            <Transition as={Fragment}>
                                                <Menu.Items className="absolute mt-2 right-0 w-48 bg-white rounded-md shadow-lg focus:outline-none">
                                                    <Menu.Item>
                                                        <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                            Your Profile
                                                        </Link>
                                                    </Menu.Item>
                                                    <Menu.Item>
                                                        <Link to="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                            Settings
                                                        </Link>
                                                    </Menu.Item>
                                                    <Menu.Item>
                                                        <Link
                                                            to="#"
                                                            onClick={() => {
                                                                AuthService.logout();
                                                                alert("You have been logged out");
                                                            }}
                                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                        >
                                                            Sign out
                                                        </Link>
                                                    </Menu.Item>
                                                </Menu.Items>
                                            </Transition>
                                        </Menu>
                                    )}
                                </div>
                                <div className="hidden lg:ml-6 lg:block">
                                    <div className="w-full max-w-lg lg:max-w-xs">
                                        <label htmlFor="search" className="sr-only">Search</label>
                                        <div className="relative">
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                            </div>
                                            <input
                                                id="search"
                                                name="search"
                                                className="block w-full rounded-md border-0 bg-green-700 py-1.5 pl-10 pr-3 text-gray-100 placeholder:text-gray-400 focus:bg-white focus:text-gray-900 focus:ring-0 sm:text-sm sm:leading-6"
                                                placeholder="Search"
                                                type="search"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Auth Links */}
                            <div className="flex flex-1 justify-center px-2 lg:ml-6 lg:justify-end">
                                <div className="flex space-x-4">
                                    {logged ? <AuthenticatedNav /> : <UnauthenticatedNav />}
                                </div>
                            </div>

                            {/* Mobile Menu Toggle */}
                            {/* <div className="flex lg:hidden">
                                <Disclosure.Button className="rounded-md px-2 py-1 text-white hover:bg-green-700 focus:outline-none">
                                    {open ? <XMarkIcon className="block h-6 w-6" aria-hidden="true" /> : <Bars3Icon className="block h-6 w-6" aria-hidden="true" />}
                                </Disclosure.Button>
                            </div> */}

                        </div>
                    </div>

                    {/* Mobile Auth Links */}
                    <Disclosure.Panel className="lg:hidden">
                        <div className="mt-3 space-y-1 px-2">
                            {logged ? <AuthenticatedNav /> : <UnauthenticatedNav />}
                        </div>
                    </Disclosure.Panel>
                </>
            )}
        </Disclosure>
    )
}
