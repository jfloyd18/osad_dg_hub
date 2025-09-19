import React, { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { SharedData } from '@/types'; // Assumes your types are in resources/js/types/index.d.ts

// --- Icon Components (no changes) ---
const HomeIcon = ({ className = 'w-6 h-6' }: { className?: string }) => ( <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg> );
const CalendarIcon = ({ className = 'w-6 h-6' }: { className?: string }) => ( <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg> );
const DocumentReportIcon = ({ className = 'w-6 h-6' }: { className?: string }) => ( <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg> );
const ExclamationIcon = ({ className = 'w-6 h-6' }: { className?: string }) => ( <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg> );
const UserGroupIcon = ({ className = 'w-6 h-6' }: { className?: string }) => ( <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.184-1.268-.5-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.184-1.268.5-1.857m0 0a3 3 0 014.5 0M12 12a3 3 0 100-6 3 3 0 000 6z" /></svg> );
const LogoutIcon = ({ className = 'w-6 h-6' }: { className?: string }) => ( <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg> );
const UserIcon = ({ className = "w-10 h-10" }: { className?: string }) => ( <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg> );
const ChevronDownIcon = ({ className }: { className?: string }) => ( <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg> );

type NavLinkItem = {
    name: string;
    icon: React.ComponentType<{ className?: string }>;
    href?: string;
    children?: { name: string; href: string }[];
};

const Sidebar = () => {
    const { auth, ziggy } = usePage<SharedData>().props;
    const currentUser = auth.user;
    const currentUrl = ziggy.location;

    const commonLinks: NavLinkItem[] = [
        { name: 'Dashboard', icon: HomeIcon, href: route('dashboard') },
        { name: 'Calendar', icon: CalendarIcon, href: route('calendar') },
    ];

    const adminLinks: NavLinkItem[] = [
        { name: 'Facility Booking', icon: DocumentReportIcon, children: [
                { name: 'Request Overview', href: route('admin.facility-booking.overview') }] },
        { 
            name: 'Student Concern', 
            icon: ExclamationIcon, 
            children: [
                { name: 'Incident Reports', href: route('admin.concerns.overview') },
                { name: 'Create Warning Slip', href: route('admin.warning-slip.create') }
            ] 
        },
        { name: 'Organization Management', icon: UserGroupIcon, href: '#' },
    ];

    const studentLinks: NavLinkItem[] = [
        {
            name: 'Facility Booking', icon: DocumentReportIcon,
            children: [
                { name: 'Request Facility', href: route('facility-booking.request') },
                { name: 'Request Overview', href: route('facility-booking.overview') },
            ],
        },
        {
            name: 'Student Concern', icon: ExclamationIcon,
            children: [
                { name: 'Concern Overview', href: route('student-concern.overview') },
                { name: 'Incident Report', href: route('student-concern.lodge') },
                { name: 'View Warnings', href: route('student-concern.warnings') },
            ],
        },
    ];

    const navLinks: NavLinkItem[] = [
        ...commonLinks,
        ...(currentUser.role === 'admin' ? adminLinks : []),
        ...(currentUser.role === 'student' ? studentLinks : []),
    ];

    const getActiveCategory = () => {
        const activeParent = navLinks.find(link => 
            link.children?.some(child => currentUrl.startsWith(child.href))
        );
        return activeParent?.name || null;
    };

    const [openMenu, setOpenMenu] = useState<string | null>(getActiveCategory);
    
    useEffect(() => {
        const activeCategory = getActiveCategory();
        if (activeCategory && activeCategory !== openMenu) {
            setOpenMenu(activeCategory);
        }
    }, [currentUrl]);

    const isParentActive = (children: { href: string }[] | undefined) => {
        if (!children) return false;
        return children.some(child => currentUrl.startsWith(child.href));
    };
    
    const handleMenuClick = (name: string) => {
        setOpenMenu(openMenu === name ? null : name);
    };

    return (
        <div className="flex flex-col h-screen w-64 bg-[#C83B51] text-white font-sans flex-shrink-0">
            <div className="flex items-center p-4 mt-4">
                <div className="flex items-center justify-center w-12 h-12 bg-white rounded-full text-[#C83B51] mr-4">
                    <UserIcon className="w-8 h-8" />
                </div>
                <div>
                    <h2 className="text-lg font-bold">{currentUser.name}</h2>
                    <p className="text-sm capitalize">{currentUser.role === 'admin' ? 'Administrator' : currentUser.role}</p>
                </div>
            </div>

            <nav className="flex-grow mt-8 px-4">
                <ul>
                    {navLinks.map((link) => (
                        <li key={link.name} className="mb-2">
                            {link.children ? (
                                <>
                                    <button onClick={() => handleMenuClick(link.name)} className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors duration-200 ${isParentActive(link.children) ? 'bg-[#B03448]' : 'hover:bg-[#B03448] hover:bg-opacity-50'}`}>
                                        <div className="flex items-center">
                                            <link.icon className="w-6 h-6 mr-4" />
                                            <span className="font-medium">{link.name}</span>
                                        </div>
                                        <ChevronDownIcon className={`w-4 h-4 transition-transform duration-200 ${openMenu === link.name ? 'rotate-180' : ''}`} />
                                    </button>
                                    {openMenu === link.name && (
                                        <ul className="pl-8 mt-2 space-y-2">
                                            {link.children.map((child) => (
                                                <li key={child.name}>
                                                    <Link href={child.href} className={`block p-2 rounded-md text-sm transition-colors duration-200 ${currentUrl.startsWith(child.href) ? 'bg-[#9d2f41]' : 'hover:bg-[#B03448] hover:bg-opacity-50'}`}>
                                                        {child.name}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </>
                            ) : (
                                <Link href={link.href!} className={`flex items-center p-3 rounded-lg transition-colors duration-200 ${currentUrl.startsWith(link.href!) ? 'bg-[#B03448]' : 'hover:bg-[#B03448] hover:bg-opacity-50'}`}>
                                    <link.icon className="w-6 h-6 mr-4" />
                                    <span className="font-medium">{link.name}</span>
                                </Link>
                            )}
                        </li>
                    ))}
                </ul>
            </nav>

            <div className="p-4 mb-4">
                <Link href={route('logout')} method="post" as="button" className="w-full flex items-center p-3 rounded-lg transition-colors duration-200 hover:bg-[#B03448] hover:bg-opacity-50">
                    <LogoutIcon className="w-6 h-6 mr-4" />
                    <span className="font-medium">Logout</span>
                </Link>
            </div>
        </div>
    );
};

export default Sidebar;

