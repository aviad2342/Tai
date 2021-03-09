import { Component, Input, OnInit } from '@angular/core';
import { Testimony } from '../testimony.model';

@Component({
  selector: 'app-testimony-item',
  templateUrl: './testimony-item.component.html',
  styleUrls: ['./testimony-item.component.scss'],
})
export class TestimonyItemComponent implements OnInit {

  @Input() testimony: Testimony;
  @Input() index: number;
  right: boolean;

  constructor() { }

  ngOnInit() {
    this.right = (this.index % 2) === 0 ;
  }

}
