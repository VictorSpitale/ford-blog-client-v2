import React from 'react';
import Image from "next/image";

const ProfilePicture = ({src}: { src: string }) => {
    return (
        <div className={"rounded-full overflow-hidden w-[50px] h-[50px]"}>
            <Image alt={"profile picture"} src={src} width={"50"} height={"50"}/>
        </div>
    );
};

export default ProfilePicture;