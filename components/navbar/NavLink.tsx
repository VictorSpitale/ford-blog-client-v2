import React from 'react';
import Link from 'next/link'
import {useRouter} from "next/router";

type PropsType = {
    href: string;
    label: string;
}

const NavLink = ({href, label}: PropsType) => {

    const router = useRouter();
    return (
        <Link shallow={router.pathname === href} href={href}>
            {label}
        </Link>
    );
};

export default NavLink;