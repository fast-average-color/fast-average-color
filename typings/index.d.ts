declare module 'fast-average-color' {
  export type IFastAverageColorRgb = [red: number, green: number, blue: number] // [red 0-255, green 0-255, blue 0-255]
  export type IFastAverageColorRgba = [red: number, green: number, blue: number, alpha: number] // [red 0-255, green 0-255, blue 0-255, opacity 0-255]
  export type IFastAverageColorRgbaWithThreshold = [
    red: number,
    green: number,
    blue: number,
    alpha: number,
    threshold: number
  ] // [red 0-255, green 0-255, blue 0-255, alpha 0-255, threshold 0-255]

  export type IFastAverageIgnoredColor =
    | IFastAverageColorRgb
    | IFastAverageColorRgb[]
    | IFastAverageColorRgba
    | IFastAverageColorRgba[]
    | IFastAverageColorRgbaWithThreshold
    | IFastAverageColorRgbaWithThreshold[]

  export type IFastAverageColorData = number[] | Uint8Array | Uint8ClampedArray

  export interface IFastAverageColorOptions {
    algorithm?: 'simple' | 'sqrt' | 'dominant'

    mode?: 'precision' | 'speed'

    step?: number

    left?: number
    top?: number

    width?: number
    height?: number

    defaultColor?: IFastAverageColorRgba
    ignoredColor?: IFastAverageIgnoredColor

    silent?: boolean
  }

  export interface IFastAverageColorResult {
    value: IFastAverageColorRgba
    rgb: string
    rgba: string
    hex: string
    hexa: string
    isDark: boolean
    isLight: boolean
    error?: Error
  }

  export interface IFastAverageColor {
    getColor(
      resource: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement | null,
      options?: IFastAverageColorOptions
    ): IFastAverageColorResult
    getColorAsync(
      resource: string | HTMLImageElement | HTMLVideoElement | HTMLCanvasElement | null,
      options?: IFastAverageColorOptions
    ): Promise<IFastAverageColorResult>
    getColorFromArray4(
      arr: IFastAverageColorData,
      options?: IFastAverageColorOptions
    ): IFastAverageColorRgba
    prepareResult(value: IFastAverageColorRgba): IFastAverageColorResult
    destroy(): void
  }

  export interface IFastAverageColorStatic {
    new (): IFastAverageColor
  }
  const FastAverageColor: IFastAverageColorStatic
  export default FastAverageColor
}
