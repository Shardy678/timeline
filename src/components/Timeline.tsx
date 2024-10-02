import React, { useEffect, useRef, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import gsap from 'gsap'
import { Navigation, Pagination } from 'swiper/modules'
import { TimelinesData } from '../timelineTypes'
import timelines from '../timelines.json'

const Timeline: React.FC = () => {
  const [timelinesData] = useState<TimelinesData>(timelines)
  const [activeSlide, setActiveSlide] = useState(0)
  const [previousSlide, setPreviousSlide] = useState(0)
  const [rotation, setRotation] = useState(0)
  const [isFirstLoad, setIsFirstLoad] = useState(true)

  const swiperRef = useRef<any>(null)
  const pRefs = useRef<(HTMLParagraphElement | null)[]>([])

  const totalCircles = timelinesData.timelines.length
  const circles = Array.from({ length: totalCircles })
  const radius = 265
  const anglePerDot = 360 / totalCircles
  const years = timelinesData.timelines[activeSlide].titleYears

  useEffect(() => {
    animateYearChange()
    positionDots()
    animateCircleRotation()
    setPreviousSlide(activeSlide)
    setIsFirstLoad(false)
  }, [activeSlide])

  const animateYearChange = () => {
    const animateYear = (selector: string, year: number) => {
      gsap.fromTo(
        selector,
        { innerText: year - 1 },
        {
          innerText: year,
          ease: 'power1.out',
          duration: 0.75,
          snap: { innerText: 1 },
        }
      )
    }
    animateYear('.left-year', years[0])
    animateYear('.right-year', years[1])

    gsap.fromTo(
      '.swiper-container',
      { opacity: 0, y: 25 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
    )
  }

  const positionDots = () => {
    circles.forEach((_, index) => {
      const angle = (360 / totalCircles) * index - 60
      const x = Math.cos((angle * Math.PI) / 180) * radius
      const y = Math.sin((angle * Math.PI) / 180) * radius

      gsap.set(`.dot:nth-child(${index + 1})`, {
        x,
        y,
        transformOrigin: '50% 50%',
        duration: 0,
        ease: 'none',
      })
    })
  }

  const animateCircleRotation = () => {
    const totalSlides = totalCircles
    let slideDifference = activeSlide - previousSlide

    if (slideDifference > totalSlides / 2) slideDifference -= totalSlides
    else if (slideDifference < -totalSlides / 2) slideDifference += totalSlides

    const newRotation = rotation - slideDifference * anglePerDot

    gsap.to('.circle-container', {
      rotate: newRotation,
      duration: 0.75,
      ease: 'power2.out',
      onComplete: () => {
        gsap.fromTo(
          pRefs.current[activeSlide],
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.75, ease: 'power2.out' }
        )
      },
    })

    gsap.to('.dot', { rotation: -newRotation, duration: 0, ease: 'none' })

    if (!isFirstLoad) {
      gsap.to(pRefs.current[previousSlide], {
        opacity: 0,
        duration: 0,
        ease: 'none',
      })
    }

    setRotation(newRotation)
  }

  const handleSlideChange = (newSlide: number) => setActiveSlide(newSlide)

  const renderNavButton = (
    direction: 'prev' | 'next',
    disabled: boolean,
    onClick: () => void
  ) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`nav-button ${direction} ${disabled ? 'disabled' : ''}`}
    >
      <span
        className={`chevron ${direction === 'prev' ? 'left' : 'right'}`}
      ></span>
    </button>
  )

  return (
    <>
      <div className="container">
        <div className="circle-container">
          {circles.map((_, index) => (
            <div
              key={index}
              className={`dot ${activeSlide === index ? 'active' : ''}`}
              onClick={() => handleSlideChange(index)}
            >
              <div className="dot-content">
                <span>{index + 1}</span>
                <p ref={(el) => (pRefs.current[index] = el)}>
                  {timelinesData.timelines[activeSlide].title}
                </p>
              </div>
            </div>
          ))}
        </div>

        <h1 className="dates">Исторические даты</h1>
        <div className="content">
          <div className="title-years">
            <h1 className="left-year">{years[0]}</h1>
            <h1 className="right-year">{years[1]}</h1>
          </div>
          <p className="mobile-title">
            {timelinesData.timelines[activeSlide].title}
          </p>

          <hr />
          <p className="pagination">{`0${activeSlide + 1}/06`}</p>

          <div className="nav-buttons">
            {renderNavButton('prev', activeSlide === 0, () =>
              handleSlideChange(Math.max(0, activeSlide - 1))
            )}
            {renderNavButton('next', activeSlide === totalCircles - 1, () =>
              handleSlideChange(Math.min(totalCircles - 1, activeSlide + 1))
            )}
          </div>

          <Swiper
            onInit={(swiper) => (swiperRef.current = swiper)}
            className="myswiper"
            slidesPerView={3}
            breakpoints={{
              1440: { slidesPerView: 3.5 },
              968: { slidesPerView: 2.5 },
              440: { slidesPerView: 1.5 },
            }}
            modules={[Navigation, Pagination]}
            navigation
            pagination={{ clickable: true }}
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

      <div className="swiper-pagination"></div>

      <div className="mobile-nav-buttons">
        <p className="pagination">{`0${activeSlide + 1}/06`}</p>
        <div className="button-container">
          {renderNavButton('prev', activeSlide === 0, () =>
            handleSlideChange(Math.max(0, activeSlide - 1))
          )}
          {renderNavButton('next', activeSlide === totalCircles - 1, () =>
            handleSlideChange(Math.min(totalCircles - 1, activeSlide + 1))
          )}
        </div>
      </div>
    </>
  )
}

export default Timeline
