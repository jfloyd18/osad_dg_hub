// In: resources/js/components/NavLink.tsx

import { Link, InertiaLinkProps } from '@inertiajs/react';

export default function NavLink({ active = false, className = '', children, ...props }: InertiaLinkProps & { active: boolean }) {
    return (
        <Link
            {...props}
            className={
                'flex items-center gap-3 px-3 py-2 rounded-md text-sm ' +
                (active
                    ? 'bg-white text-[#800000] font-bold'
                    : 'text-red-100 hover:bg-red-700 hover:text-white') +
                className
            }
        >
            {children}
        </Link>
    );
}