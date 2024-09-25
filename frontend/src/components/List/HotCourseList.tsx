import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from 'swiper/modules';
import { CourseInfo } from './../../types/CourseInfo';

import HotCourse from "../Card/HotCourse";

import 'swiper/css';
import 'swiper/css/navigation'; 

interface HotCourseListProps {
    data: CourseInfo[];
}

const HotCourseList = ( { data } : HotCourseListProps) => {
    return (
        <div className="border-b border-inherit">
            <Swiper
                slidesPerView={1}
                allowTouchMove={false}
                loop={true}
                autoplay={{
                    disableOnInteraction : false,
                    delay : 3000
                }}
                navigation={true} modules={[Autoplay, Navigation]}
            >
                
                {data.map((card, idx) => (
                    <SwiperSlide key={idx}>
                        <HotCourse data={card}/>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}

export default HotCourseList;