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
  const [previousSlide, setPreviousSlide] = useState(0)
  const [isFirstLoad, setIsFirstLoad] = useState(true) // New state to track initial load
  const swiperRef = useRef<any>(null)
  const pRefs = useRef<(HTMLParagraphElement | null)[]>([])

  const totalCircles = timelinesData.timelines.length
  const circles = Array.from({ length: totalCircles }, (_, index) => index + 1)
  const radius = 265

  const [rotation, setRotation] = useState(0)
  const anglePerDot = 360 / totalCircles
  const years = timelinesData.timelines[activeSlide].titleYears

  useEffect(() => {
    // Set initial year animations
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

    positionDots()

    const slideDifference = activeSlide - previousSlide
    const newRotation = rotation - slideDifference * anglePerDot

    // Animate the rotation of the circle
    gsap.to('.circle-container', {
      rotate: newRotation,
      duration: 0.75,
      ease: 'power2.out',
      onComplete: () => {
        // Fade in the <p> element for the new active slide
        gsap.fromTo(
          pRefs.current[activeSlide],
          { opacity: 0, y: 10 }, // Start at opacity 0, slightly below its final position
          { opacity: 1, y: 0, duration: 0.75, ease: 'power2.out' } // Fade in with upward motion
        )
      },
    })
    gsap.to('.dot', { rotation: -newRotation, duration: 0, ease: 'none' })

    // Only perform fade out if not the first load
    if (!isFirstLoad) {
      gsap.to(
        pRefs.current[previousSlide],
        { opacity: 0, duration: 0, ease: 'none' } // Fade out to opacity 0 and move down
      )
    }

    // Update rotation and previous slide
    setRotation(newRotation)
    setPreviousSlide(activeSlide)

    // Set isFirstLoad to false after the first render
    setIsFirstLoad(false)
  }, [activeSlide])

  const positionDots = () => {
    circles.forEach((_, index) => {
      const angle = (360 / totalCircles) * index - 60
      const x = Math.cos((angle * Math.PI) / 180) * radius
      const y = Math.sin((angle * Math.PI) / 180) * radius

      gsap.set(`.dot:nth-child(${index + 1})`, {
        x: x,
        y: y,
        transformOrigin: '50% 50%',
        duration: 0,
        ease: 'none',
      })
    })
  }

  const handleActiveSlideChange = (newSlide: number) => {
    setActiveSlide(newSlide)
    swiperRef.current.slideTo(newSlide)
  }

  return (
    <>
      <div className="container">
        <div className="circle-container">
          {circles.map((circle, index) => (
            <div
              key={index}
              className={`dot ${activeSlide === index ? 'active' : ''}`}
              onClick={() => handleActiveSlideChange(index)}
            >
              <div className="dot-content">
                <span>{circle}</span>
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
          <p>{`0${activeSlide + 1}/06`}</p>

          <div className="nav-buttons">
            <button
              onClick={() => {
                const newIndex = Math.max(0, activeSlide - 1)
                handleActiveSlideChange(newIndex)
              }}
              disabled={activeSlide === 0}
              className={`nav-button prev ${
                activeSlide === 0 ? 'disabled' : ''
              }`}
            >
              <span className="chevron left"></span>
            </button>
            <button
              onClick={() => {
                const newIndex = Math.min(totalCircles - 1, activeSlide + 1)
                handleActiveSlideChange(newIndex)
              }}
              disabled={activeSlide === totalCircles - 1}
              className={`nav-button next ${
                activeSlide === totalCircles - 1 ? 'disabled' : ''
              }`}
            >
              <span className="chevron right"></span>
            </button>
          </div>
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
    </>
  )
}

export default Timeline
