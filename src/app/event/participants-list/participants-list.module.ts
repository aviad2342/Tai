import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ParticipantsListPageRoutingModule } from './participants-list-routing.module';

import { ParticipantsListPage } from './participants-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ParticipantsListPageRoutingModule
  ],
  declarations: [ParticipantsListPage]
})
export class ParticipantsListPageModule {}
