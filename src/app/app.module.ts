import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { provideHttpClient, withFetch } from '@angular/common/http';

// NgRx imports
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';
import { authFeatureKey, authReducer } from './store/auth/auth.reducer';
import { uiFeatureKey, uiReducer } from './store/ui/ui.reducer';
import { AuthEffects } from './store/auth/auth.effects';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DashboardModule,
    StoreModule.forRoot(
      { [authFeatureKey]: authReducer, [uiFeatureKey]: uiReducer },
      {}
    ),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode() }),
    EffectsModule.forRoot([AuthEffects]),
  ],
  providers: [provideHttpClient(withFetch())],
  bootstrap: [AppComponent],
})
export class AppModule {}
