import React, { useEffect, useRef, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import gsap from 'gsap'
import 'swiper/css'
import 'swiper/css/navigation'

const Timeline = () => {
  const [activeTimelineIndex, setActiveTimelineIndex] = useState<number>(0)
  const leftYearRef = useRef<HTMLDivElement>(null) // Reference for left year
  const rightYearRef = useRef<HTMLDivElement>(null) // Reference for right year

  const timelines = [
    {
      title: 'Наука',
      titleYears: [2015, 2017],
      years: [
        {
          year: 2015,
          events: ['Солнечное затмение в Африке'],
        },
        { year: 2016, events: ['Обнаружена галактика GN-z11'] },
        { year: 2017, events: ['Tesla представила грузовик Tesla Semi'] },
      ],
    },
    {
      title: 'Технологии',
      titleYears: [2018, 2019],
      years: [
        { year: 2018, events: ['Технологическое открытие 2018'] },
        { year: 2019, events: ['Событие в 2019'] },
      ],
    },
    {
      title: 'Искусство',
      titleYears: [2020, 2024],
      years: [
        { year: 2020, events: ['Выставка 2020'] },
        { year: 2024, events: ['Ещё одна выставка в 2024'] },
      ],
    },
  ]

  useEffect(() => {
    if (leftYearRef.current && rightYearRef.current) {
      gsap.to(leftYearRef.current, {
        innerText: timelines[activeTimelineIndex].titleYears[0],
        duration: 1,
        snap: { innerText: 1 }, // Snap to whole numbers
      })
      gsap.to(rightYearRef.current, {
        innerText: timelines[activeTimelineIndex].titleYears[1],
        duration: 1,
        snap: { innerText: 1 },
      })
    }
  }, [activeTimelineIndex])

  return (
    <div className="timeline-slider">
      <h1>Исторические даты</h1>
      <div className="timeline-years" id="years">
        <div ref={leftYearRef} className="year-left">
          {timelines[activeTimelineIndex].titleYears[0]}
        </div>
        <div ref={rightYearRef} className="year-right">
          {timelines[activeTimelineIndex].titleYears[1]}
        </div>
      </div>
      <Swiper
        className="timeline-titles"
        modules={[Navigation]}
        slidesPerView={1}
        navigation
        onSlideChange={(swiper) => setActiveTimelineIndex(swiper.activeIndex)}
      >
        {timelines.map((timeline, index) => (
          <SwiperSlide key={index}>
            <div className="timeline-title">
              <h3>{timeline.title}</h3>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

export default Timeline
