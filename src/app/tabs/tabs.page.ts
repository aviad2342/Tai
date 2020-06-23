import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnInit {

  isDesktop: boolean;

  constructor(private appService: AppService) {}

  ngOnInit() {
    this.isDesktop = this.appService.isDesktop();
  }

}
