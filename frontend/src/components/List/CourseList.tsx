import { Swiper, SwiperClass, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from 'swiper/modules';
import { ReactSVG } from 'react-svg';
import Course from "../Card/Course";
import 'swiper/css';
import 'swiper/css/navigation'; // Navigation 모듈을 사용할 때 필요합니다.
import { CourseInfo } from './../../types/CourseInfo';
import { useState } from "react";

import angleLeft from './../../assets/svgs/angleLeft.svg';
import angleRight from './../../assets/svgs/angleRight.svg';

interface CourseListProps {
    data: CourseInfo[],
    title: string,
    subTitle: string
}

const CourseList = ({ data, title, subTitle }: CourseListProps) => {

    const [swiper, setSwiper] = useState<SwiperClass>();

    const handlePrev = () => {
        swiper?.slidePrev()
    }
    const handleNext = () => {
        swiper?.slideNext()
    }

    return (
        <div className="flex flex-row items-center">
            <button type="button"
                className="bg-white hover:text-white hover:bg-gray-100 focus:outline-none
                        font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center
                        h-min mx-2"
                onClick={handlePrev} >
                <ReactSVG src={angleLeft} />
            </button>
            <div className="w-[85%] mx-auto mt-5">
                <h1 className="mb-4 text-2xl font-extrabold leading-none tracking-tight text-gray-900 md:text-2xl lg:text-2xl dark:text-white">{title}</h1>
                <p className="text-base text-gray-500 mb-5">{subTitle}</p>
                
                    <Swiper
                        slidesPerView={5}
                        loop={true}
                        spaceBetween={10} // spaceBetween 속성을 추가합니다.
                        modules={[Autoplay, Navigation]}
                        onSwiper={(e) => { setSwiper(e) }}
                    >
                        {data.map((card, idx) => (
                            <SwiperSlide key={idx}>
                                <Course data={card} bar={false} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                
            </div>
            <button type="button"
                className="bg-white hover:text-white hover:bg-gray-100 focus:outline-none
                        font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center
                        h-min mx-2"
                onClick={handleNext} >
                <ReactSVG src={angleRight} />
            </button>
        </div>
    );
}

export default CourseList;
