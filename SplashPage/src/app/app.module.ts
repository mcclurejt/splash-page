import { CalendarDialogComponent } from './calendar/calendar-dialog/calendar-dialog.component';
import { GmailService } from './google/gmail.service';
import { GoogleCalendarService } from './google/google-calendar.service';
import { GapiService } from './google/gapi.service';
import { AuthService } from './services/auth.service';
import { WeatherService } from './services/weather.service';
import { FireService } from './services/fire.service';
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
import { TimeComponent } from './time/time.component';
import { WeatherComponent } from './weather/weather.component';
import { HttpModule } from '@angular/http';
import { CalendarComponent} from './calendar/calendar.component';
import { MailComponent } from './mail/mail.component';
import { EmailObjectComponent } from './email-object/email-object.component';
import { NavbarComponent } from './navbar/navbar.component';
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
import { InlineEditComponent } from './inline-edit/inline-edit.component';
import { TruncatePipe } from './pipes/truncate.pipe';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';



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
    InlineEditComponent,
    TruncatePipe,
    CalendarDialogComponent,
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
  ],
  providers: [
    WeatherService,
    AuthService,
    FireService,
    GapiService,
    GoogleCalendarService,
    GmailService,
    ],
  entryComponents: [
    CalendarDialogComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
