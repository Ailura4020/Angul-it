import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app'; // On importe bien AppComponent

bootstrapApplication(AppComponent, appConfig) // Et on lance AppComponent
  .catch((err) => console.error(err));