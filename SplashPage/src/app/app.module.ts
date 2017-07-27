import { CalendarDialogComponent } from './components/calendar-dialog/calendar-dialog.component';
import { CalendarService } from './services/calendar.service';
import { GmailService } from './content-providers/google/gmail.service';
import { GcalService } from './content-providers/google/gcal.service';
import { GapiService } from './content-providers/google/gapi.service';
import { AuthService } from './services/auth.service';
import { WeatherService } from './services/weather.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngularFireModule } from 'angularfire2';
import { environment } from '../environments/environment';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HomeComponent } from './+home/home.component';
import { TimeComponent } from './components/time/time.component';
import { WeatherComponent } from './components/weather/weather.component';
import { HttpModule } from '@angular/http';
import { CalendarComponent} from './components/calendar/calendar.component';
import { MailComponent } from './components/mail/mail.component';
import { EmailObjectComponent } from './email-object/email-object.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { DatePipe } from '@angular/common'
import {
  MdAutocompleteModule,
  MdButtonModule,
  MdButtonToggleModule,
  MdCardModule,
  MdCheckboxModule,
  MdChipsModule,
  MdDialogModule,
  MD_DIALOG_DATA,
  MdGridListModule,
  MdIconModule,
  MdInputModule,
  MdListModule,
  MdMenuModule,
  MdProgressBarModule,
  MdProgressSpinnerModule,
  MdRadioModule,
  MdRippleModule,
  MdSelectModule,
  MdSidenavModule,
  MdSliderModule,
  MdSlideToggleModule,
  MdSnackBarModule,
  MdTabsModule,
  MdToolbarModule,
  MdTooltipModule
} from '@angular/material';
import { EventPipe } from './pipes/event.pipe';
import { TruncatePipe } from './pipes/truncate.pipe';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { FormsModule } from "@angular/forms";
import { TimePipe } from './pipes/time.pipe';
import { StoreModule } from '@ngrx/store';
import { weatherReducer } from './stores/weather.store';

export const MaterialModules = [
  MdAutocompleteModule,
  MdButtonModule,
  MdButtonToggleModule,
  MdCardModule,
  MdChipsModule,
  MdCheckboxModule,
  MdDialogModule,
  MdGridListModule,
  MdIconModule,
  MdInputModule,
  MdListModule,
  MdMenuModule,
  MdProgressBarModule,
  MdProgressSpinnerModule,
  MdRadioModule,
  MdRippleModule,
  MdSelectModule,
  MdSidenavModule,
  MdSliderModule,
  MdSlideToggleModule,
  MdSnackBarModule,
  MdTabsModule,
  MdToolbarModule,
  MdTooltipModule,
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    TimeComponent,
    WeatherComponent,
    CalendarComponent,
    MailComponent,
    EmailObjectComponent,
    NavbarComponent,
    EventPipe,
    TruncatePipe,
    CalendarDialogComponent,
    TimePipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule, // imports firebase/database, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth 
    BrowserAnimationsModule,
    MaterialModules,
    FlexLayoutModule,
    HttpModule,
    InfiniteScrollModule,
    FormsModule,
    StoreModule.forRoot({weather: weatherReducer})
  ],
  providers: [
    WeatherService,
    AuthService,
    GapiService,
    GcalService,
    GmailService,
    CalendarService,
    ],
  entryComponents: [
    CalendarDialogComponent,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
