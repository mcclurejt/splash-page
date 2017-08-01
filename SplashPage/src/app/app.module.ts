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
import { TruncatePipe } from './pipes/truncate.pipe';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { FormsModule } from "@angular/forms";
import { TimePipe } from './pipes/time.pipe';
import { StoreModule } from '@ngrx/store';
import { reducers } from './store/reducers';
import { Angular2FontawesomeModule } from 'angular2-fontawesome/angular2-fontawesome';
import { AgendaViewComponent } from './components/calendar/agenda-view/agenda-view.component';
import { CalendarTabComponent } from './+calendar-tab/calendar-tab.component';
import { WeekViewComponent } from './components/calendar/week-view/week-view.component';

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
    NavbarComponent,
    TruncatePipe,
    CalendarDialogComponent,
    TimePipe,
    AgendaViewComponent,
    CalendarTabComponent,
    WeekViewComponent,
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
    StoreModule.forRoot(reducers),
    Angular2FontawesomeModule,
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
