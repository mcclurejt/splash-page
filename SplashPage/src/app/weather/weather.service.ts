import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

@Injectable()
export class WeatherService {

  weatherApiKey = '&APPID=dd6e2828f19f1157a6935e1e7d8f6b9e';
  weatherBaseUrl = 'http://api.openweathermap.org/data/2.5/weather?lat='
  units = 'imperial';

  constructor(private http: Http) { }

  // getLocation(position): Observable<any> {
  //   let latitude = position.coords.latitude;
  //   let longitude = position.coords.longitude;
  //   let url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=` + String(latitude) + `,` + String(longitude) + `&key=` + this.mapsApiKey;
  //   return this.http.get(url).map(this.extractData);
  // }

  // getWeather(location): Observable<any> {
  //   let zipcode = location.results[3].address_components[0].short_name;
  //   let country = location.results[3].address_components[3].short_name;
  //   let url = 'http://api.openweathermap.org/data/2.5/weather?zip=' + zipcode + ',' + country + this.weatherApiKey;
  //   return this.http.get(url).map(this.extractData);
  // }

  load(latitude, longitude): Promise<any> {
    return new Promise(resolve => {
      let url = this.weatherBaseUrl + latitude + '&lon=' + longitude + '&units=' + this.units + this.weatherApiKey;
      this.http.get(url)
        .map(this.extractData)
        .subscribe(weatherData => {
          resolve(weatherData);
        })
    })
  }

  getIPLocation(): Promise<any> {
    return new Promise(resolve => {
      let url = 'http://ipinfo.io/json'
      this.http.get(url)
        .map(this.extractData)
        .subscribe(locationData => {
          resolve(locationData)
        })
    })
  }

  private extractData(res: Response) {
    let body = res.json();
    return body
  }

}
