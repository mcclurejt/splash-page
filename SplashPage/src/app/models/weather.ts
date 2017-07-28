export class Weather {
    constructor(
        public city: string,
        public region: string,
        public temp: string,
        public icon: string,
    ) { }
}

export const initialWeather: Weather = {
    city: null,
    region: null,
    temp: null,
    icon: null,
}
