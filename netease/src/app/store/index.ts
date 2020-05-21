import { NgModule } from '@angular/core';
import {StoreModule} from '@ngrx/store';
import {playerReducer} from './reducers/player.reducers';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {environment} from '../../environments/environment';



@NgModule({
  declarations: [],
  imports: [
    StoreModule.forRoot({player: playerReducer}, {
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true,
        strictStateSerializability: true,
        strictActionSerializability: true,
        strictActionWithinNgZone: true
      }
    }),
    StoreDevtoolsModule.instrument({
      maxAge: 20,
      logOnly: environment.production
    })
  ]
})
export class APPStoreModule { }
