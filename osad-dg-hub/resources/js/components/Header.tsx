import React from 'react';

// --- SVG Icons ---
// You can replace these with your preferred icon library if you have one.

const LogoIcon = ({ className = 'w-8 h-8' }: { className?: string }) => (
    <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="40" height="40" rx="8" fill="#C83B51"/>
        <path d="M26.25 19.9999L16.875 25.1819V14.818L26.25 19.9999Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);


const BellIcon = ({ className = 'w-6 h-6' }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
);

const SpeakerIcon = ({ className = 'w-6 h-6' }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-2.236 9.364-5.516l.08.08c.29.29.515.63.67 1.011l.178 1.485a11.951 11.951 0 01-8.849 8.849l-1.485.178c-.38.155-.722.38-1.01.67l-.08.08a4.001 4.001 0 01-2.246.812z" />
    </svg>
);


// --- Main Header Component ---

const Header = () => {
    return (
        <header className="bg-white shadow-sm w-full">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Left side: Logo and Title */}
                    <div className="flex items-center">
                        <LogoIcon />
                        <h1 className="ml-3 text-xl font-bold text-gray-800">
                            OSAD Digital Hub
                        </h1>
                    </div>

                    {/* Right side: Icons */}
                    <div className="flex items-center space-x-5">
                        <button className="text-gray-500 hover:text-gray-700 focus:outline-none">
                            <BellIcon className="w-6 h-6" />
                        </button>
                        <button className="text-gray-500 hover:text-gray-700 focus:outline-none">
                            <SpeakerIcon className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;