import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';
import { ConnectComponent } from './connect/connect.component';
import { ConnectedComponent } from './connected/connected.component';
import { LoginComponent } from './connected/login/login.component';
import { RegisterComponent } from './connected/register/register.component';
import { ConnectAuthGuard } from './auth/connect-auth.guard';
import { ChooseRoleComponent } from './choose-role/choose-role.component';
import { ChooseRoleGuard } from './auth/choose-role.guard';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { UiTestComponent } from './ui-test/ui-test.component';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material';

const appRoutes: Routes = [
  // { path: 'crisis-center', component: CrisisListComponent },
  // { path: 'hero/:id',      component: HeroDetailComponent },
  {
    path: 'connected',
    component: ConnectedComponent,
    canActivate: [ConnectAuthGuard],
    // data: { title: 'Heroes List' }
  },
  {
    path: 'chooseRole',
    component: ChooseRoleComponent,
    canActivate: [ChooseRoleGuard],
    // data: { title: 'Heroes List' }
  },
  { path: '',
    // redirectTo: '/heroes',
    // pathMatch: 'full'
    component: ConnectComponent
  },
  // { path: '**', component: PageNotFoundComponent }
];
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ConnectComponent,
    RegisterComponent,
    ConnectedComponent,
    ChooseRoleComponent,
    UiTestComponent,
  ],
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: false } // <-- debugging purposes only
    ),
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MaterialModule
  ],
  providers: [
    {provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 2000, horizontalPosition: 'center', verticalPosition: 'top'}}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
