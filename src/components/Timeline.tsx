import React, { useEffect, useRef, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import gsap from 'gsap'
import { Navigation } from 'swiper/modules'
import { TimelinesData } from '../timelineTypes'
import timelines from '../timelines.json'

const Timeline: React.FC = () => {
  const [timelinesData, setTimelines] = useState<TimelinesData>(timelines)
  const [activeSlide, setActiveSlide] = useState(0)
  const swiperRef = useRef<any>(null)

  const years = timelinesData.timelines[activeSlide].titleYears

  useEffect(() => {
    gsap.fromTo(
      '.left-year',
      { innerText: years[0] - 1 },
      {
        innerText: years[0],
        ease: 'power1.out',
        duration: 0.75,
        snap: { innerText: 1 },
      }
    )
    gsap.fromTo(
      '.right-year',
      { innerText: years[1] - 1 },
      {
        innerText: years[1],
        ease: 'power1.out',
        duration: 0.75,
        snap: { innerText: 1 },
      }
    )
    gsap.fromTo(
      '.swiper-container',
      { opacity: 0, y: 25 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
    )
  }, [activeSlide])

  const totalCircles = timelinesData.timelines.length

  return (
    <div className="container">
      <h1 className="dates">Исторические даты</h1>
      <div className="content">
        <div className="title-years">
          <h1 className="left-year">{years[0]}</h1>
          <h1 className="right-year">{years[1]}</h1>
        </div>
        <p>{`0${activeSlide + 1}/06`}</p>

        <div className="nav-buttons">
          <button
            onClick={() => {
              const newIndex = Math.max(0, activeSlide - 1)
              setActiveSlide(newIndex)
              swiperRef.current.slideTo(newIndex)
            }}
            disabled={activeSlide === 0}
            className={`nav-button prev ${activeSlide === 0 ? 'disabled' : ''}`}
          >
            <span className="chevron left"></span>
          </button>
          <button
            disabled={activeSlide === totalCircles - 1}
            onClick={() => {
              const newIndex = Math.min(totalCircles - 1, activeSlide + 1)
              setActiveSlide(newIndex)
              swiperRef.current.slideTo(newIndex)
            }}
            className={`nav-button next ${
              activeSlide === totalCircles - 1 ? 'disabled' : ''
            }`}
          >
            <span className="chevron right"></span>
          </button>
        </div>
        <h3>{timelinesData.timelines[activeSlide].title}</h3>
        <Swiper
          onInit={(swiper) => {
            swiperRef.current = swiper
          }}
          className="myswiper"
          slidesPerView={3}
          modules={[Navigation]}
          navigation
        >
          {timelinesData.timelines[activeSlide].years.map((event, index) => (
            <SwiperSlide key={index}>
              <div className="swiper-container">
                <p className="year">{event.year}</p>
                <h3 className="events">{event.events}</h3>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  )
}

export default Timeline
