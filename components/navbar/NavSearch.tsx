import React, {useEffect, useState} from 'react';
import styles from "../../styles/Navbar.module.css";
import SimplifiedPostCard from "../posts/SimplifiedPostCard";
import {AnyFunction} from "../../shared/types/props.type";
import {IPost} from "../../shared/types/post.type";
import {useFetch, useTranslation} from "../../shared/hooks";
import {IMethods} from "../../shared/types/methods.type";
import {useAppDispatch, useAppSelector} from "../../context/hooks";
import {setQuery} from "../../context/actions/navSearch.actions";

type PropsType = {
    onClick: AnyFunction;
}

const NavSearch = ({onClick}: PropsType) => {

    const [posts, setPosts] = useState<IPost[]>([])
    const {query} = useAppSelector(state => state.navSearch);
    const [previousQuery, setPreviousQuery] = useState('')
    const {load} = useFetch('/posts/query?search=' + query, IMethods.GET, (data) => setPosts(data as IPost[]));
    const t = useTranslation()
    const dispatch = useAppDispatch();

    const onInput = async (ev: React.ChangeEvent<HTMLInputElement>) => {
        const search = ev.target.value
        dispatch(setQuery({query: search.trim()}));
    }

    useEffect(() => {
        const fetch = async () => {
            if (query.length < 3) {
                setPosts([])
                setPreviousQuery("")
            } else if (query.length >= 3 && (Math.abs(query.length - previousQuery.length) >= 3) && query != previousQuery) {
                await load(null);
                setPreviousQuery(query)
            }
        }
        fetch()
    }, [query])

    return (<>
            <div className={styles.search_form}>
                <input type="search" onChange={onInput} placeholder={t.common.keywords} value={query} />
            </div>
            <div data-content={"result-container"} className={styles.search_result_container}>
                {(posts.length === 0 && query != "") ?
                    <div className={styles.search_result_item} style={{height: "fit-content", padding: "5px"}}>
                        {t.common.noResult}</div> :
                    posts.map((post, index) => {
                        return <SimplifiedPostCard key={index} post={post} onClick={onClick} />
                    })
                }
            </div>
        </>
    );
};

export default NavSearch;