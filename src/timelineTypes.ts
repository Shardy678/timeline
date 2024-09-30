export interface YearEvent {
  year: number
  events: string[]
}

export interface Timeline {
  title: string
  titleYears: number[]
  years: YearEvent[]
}

export interface TimelinesData {
  timelines: Timeline[]
}
