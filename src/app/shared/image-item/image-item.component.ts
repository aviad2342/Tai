import { Component, Input, OnInit } from '@angular/core';
import { NgxDropzonePreviewComponent } from 'ngx-dropzone';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-image-item',
  templateUrl: './image-item.component.html',
  styleUrls: ['./image-item.component.scss'],
})
export class ImageItemComponent extends NgxDropzonePreviewComponent implements OnInit {

  @Input() image: string;

  constructor(public sanitizer: DomSanitizer) {
    super(sanitizer);
  }

    /** The image data source. */
    imageSrc: string | ArrayBuffer = '';

  ngOnInit() {
    this.imageSrc = this.image
  }

}
