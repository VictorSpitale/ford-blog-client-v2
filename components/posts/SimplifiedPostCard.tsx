import React, {memo} from 'react';
import {IBasicPost} from "../../shared/types/post.type";
import styles from "../../styles/Navbar.module.css";
import Image from 'next/image'
import {getPostCardImg} from "../../shared/images/postCardImg";
import Link from 'next/link'
import {AnyFunction} from "../../shared/types/props.type";
import {blurImg} from "../../shared/images/blurImg";

type PropsType = {
    post: IBasicPost;
    onClick?: AnyFunction;
}

const SimplifiedPostCard = ({post, onClick}: PropsType) => {

    return (
        <Link href={"/post/" + post.slug}>
            <a className={styles.search_result_item} onClick={onClick}>
                {post.picture && <div className={styles.search_result_item_image_container}>
					<Image
						className={styles.search_result_item_image} src={getPostCardImg(post)} width={"200px"}
						height={"100px"}
						objectFit={"cover"} alt={post.title} placeholder={"blur"}
						blurDataURL={blurImg} />
				</div>}
                <div className={styles.search_result_item_content}>
                    <h1 className={"line-clamp-1 text-xl pt-2 pl-2"}>{post.title}</h1>
                    <p className={"pl-2 break-words text-sm line-clamp-3"}>{post.desc}</p>
                </div>
            </a>
        </Link>
    );
};
export default memo(SimplifiedPostCard);