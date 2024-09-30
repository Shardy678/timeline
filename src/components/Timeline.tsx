import React, { useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import gsap from 'gsap'
import { Navigation } from 'swiper/modules'

const Timeline = () => {
  const [activeSlide, setActiveSlide] = useState(0)

  const timelines = [
    {
      title: 'Наука',
      titleYears: [2015, 2018],
      years: [
        { year: 2015, events: ['Солнечное затмение в Африке'] },
        { year: 2016, events: ['Обнаружена галактика GN-z11'] },
        { year: 2017, events: ['Tesla представила грузовик Tesla Semi'] },
        { year: 2018, events: ['Tesla представила Model 3'] },
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
    {
      title: 'История',
      titleYears: [2024, 2028],
      years: [
        { year: 2024, events: ['Выставка 2024'] },
        { year: 2028, events: ['Ещё одна выставка в 2028'] },
      ],
    },
    {
      title: 'Музыка',
      titleYears: [2028, 2032],
      years: [
        { year: 2028, events: ['Выставка 2028'] },
        { year: 2032, events: ['Ещё одна выставка в 2032'] },
      ],
    },
    {
      title: 'Кинематограф',
      titleYears: [2032, 2036],
      years: [
        { year: 2032, events: ['Выставка 2032'] },
        { year: 2036, events: ['Ещё одна выставка в 2036'] },
      ],
    },
  ]
  const [years, setYears] = useState(timelines[activeSlide].titleYears)

  const totalCircles = timelines.length

  useEffect(() => {
    gsap.fromTo(
      '.left-year',
      { innerText: years[0] },
      {
        innerText: timelines[activeSlide].titleYears[0],
        duration: 0.5,
        snap: { innerText: 1 },
      }
    )
    gsap.fromTo(
      '.right-year',
      { innerText: years[1] },
      {
        innerText: timelines[activeSlide].titleYears[1],
        duration: 0.5,
        snap: { innerText: 1 },
      }
    )
  }, [activeSlide])

  return (
    <div className="container">
      <h1 className="dates">Исторические даты</h1>
      <div className="content">
        <div className="title-years">
          <h1 className="left-year">{timelines[activeSlide].titleYears[0]}</h1>
          <h1 className="right-year">{timelines[activeSlide].titleYears[1]}</h1>
        </div>
        <p>{`0${activeSlide + 1}/06`}</p>

        <div className="nav-buttons">
          <button
            onClick={() => setActiveSlide(Math.max(0, activeSlide - 1))}
            disabled={activeSlide === 0}
            className={`nav-button prev ${activeSlide === 0 ? 'disabled' : ''}`}
          >
            <span className="chevron left"></span>
          </button>
          <button
            disabled={activeSlide === 5}
            onClick={() =>
              setActiveSlide(Math.min(totalCircles - 1, activeSlide + 1))
            }
            className={`nav-button next ${activeSlide === 5 ? 'disabled' : ''}`}
          >
            <span className="chevron right"></span>
          </button>
        </div>
        <h3>{timelines[activeSlide].title}</h3>
        <Swiper
          className="myswiper"
          slidesPerView={3}
          modules={[Navigation]}
          navigation
        >
          {timelines[activeSlide].years.map((event, index) => (
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
