import React, {useEffect} from 'react';
import {useAppDispatch, useAppSelector} from "../../../context/hooks";
import Slider from "react-slick";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {className} from "../../../shared/utils/class.utils";
import {setCategorySlide} from "../../../context/actions/categories.actions";
import {useRouter} from "next/router";
import Link from "next/link";
import {isEmpty} from "../../../shared/utils/object.utils";
import {useTranslation} from "../../../shared/hooks";

const CategoriesSlider = () => {

    const {categories} = useAppSelector(state => state.categories);
    const {category} = useAppSelector(state => state.categorySlide);
    const dispatch = useAppDispatch();
    const router = useRouter();
    const t = useTranslation();

    useEffect(() => {
        if (router.query.selected && !isEmpty(categories)) {
            if (router.query.selected !== category?.name) {
                dispatch(setCategorySlide({category: categories.find((cat) => cat.name === router.query.selected)}));
            }
        }
    }, [router.query, categories]);

    return (
        <>
            <Slider infinite={true} slidesToShow={3} slidesToScroll={3} dots={true} nextArrow={<></>}
                    prevArrow={<></>} adaptiveHeight={true} focusOnSelect={true}
                    responsive={[
                        {
                            breakpoint: 480,
                            settings: {
                                slidesToShow: 1,
                                slidesToScroll: 1
                            }
                        }
                    ]}>
                {categories.map((cat, index) => {
                    return <Link href={`/categories?selected=${cat.name}`} passHref={true} key={index}>
                        <div
                            className={className("w-full h-24 rounded-2xl !flex justify-center items-center cursor-pointer transition",
                                category?._id === cat._id ? "bg-secondary-300" : "bg-secondary-200", "hover:bg-secondary-300")}>
                            <p className={className("text-xl text-secondary-800")}>{cat.name}</p>
                        </div>
                    </Link>
                })}
            </Slider>
            {categories.length === 0 && <p className={"text-center"}>{t.categories.noCat}</p>}
        </>
    );
};

export default CategoriesSlider;