import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';

@Component({
  selector: 'app-management-tool',
  templateUrl: './management-tool.page.html',
  styleUrls: ['./management-tool.page.scss'],
})
export class ManagementToolPage implements OnInit {

  isDesktop: boolean;

  constructor(private appService: AppService ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.isDesktop = this.appService.isDesktop();
  }

}
