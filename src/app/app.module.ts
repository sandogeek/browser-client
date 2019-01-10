import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
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
import { GamingComponent } from './gaming/gaming.component';
import { GamingGuard } from './auth/gaming.guard';
import { NgZorroAntdModule, NZ_I18N, en_US, zh_CN } from 'ng-zorro-antd';
import { HttpClientModule } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { BackpackComponent } from './gaming/backpack/backpack.component';
import { EquipComponent } from './gaming/equip/equip.component';
import { ChatComponent } from './gaming/chat/chat.component';
import { MailComponent } from './gaming/mail/mail.component';
import { ShopComponent } from './gaming/shop/shop.component';
import { ResizeSensorModule } from '@progress/kendo-angular-resize-sensor';
import { AutoScrollToBottomDirective } from './gaming/chat/directive/auto-scroll.directive';

registerLocaleData(zh);

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
  },
  {
    path: 'gaming',
    component: GamingComponent,
    canActivate: [GamingGuard],
  },
  { path: '',
    // redirectTo: '/heroes',
    // pathMatch: 'full'
    component: ConnectComponent
  },
  // { path: '**', component: PageNotFoundComponent }
];
@NgModule({
  entryComponents: [
    BackpackComponent,
    EquipComponent,
    ChatComponent,
    MailComponent,
    ShopComponent,
  ],
  declarations: [
    AppComponent,
    LoginComponent,
    ConnectComponent,
    RegisterComponent,
    ConnectedComponent,
    ChooseRoleComponent,
    UiTestComponent,
    GamingComponent,
    BackpackComponent,
    EquipComponent,
    ChatComponent,
    MailComponent,
    ShopComponent,
    AutoScrollToBottomDirective,
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
    MaterialModule,
    NgZorroAntdModule,
    HttpClientModule,
    ResizeSensorModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'zh' },
    // {provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 2000, horizontalPosition: 'center', verticalPosition: 'top'},
    { provide: NZ_I18N, useValue: zh_CN }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
