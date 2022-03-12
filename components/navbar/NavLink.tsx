import React from 'react';
import Link from 'next/link'
import {useRouter} from "next/router";

const NavLink = ({href, label}: { href: string, label: string }) => {

    const router = useRouter()
    return (
        <Link shallow={router.pathname === href} href={href}>
            {label}
        </Link>
    );
};

export default NavLink;