export interface Scale {
  id: string,
  name: string,
  toneIntervalPattern: string[],
  chordPattern: string[]
}

export interface Tone {
  id: string,
  name: string
}

export interface ToneAlias {
  id: string,
  name: string
}

export interface ToneAlteration {
  id: string,
  symbol: string,
  name: string
}