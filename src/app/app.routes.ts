import { Routes } from '@angular/router';

// REMARQUE IMPORTANTE :
// On importe depuis './dossier/fichier' (sans extension .ts)
// Donc './home/home' et non './home/home.component'
import { HomeComponent } from './home/home';
import { CaptchaComponent } from './captcha/captcha';
import { ResultComponent } from './result/result';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'captcha', component: CaptchaComponent },
  { path: 'result', component: ResultComponent },
  { path: '**', redirectTo: '' }
];