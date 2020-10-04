import { GALLERY_IMAGE } from 'ngx-image-gallery';


export class GalleryImage implements GALLERY_IMAGE {

    constructor(
      public url: string,
      public thumbnailUrl?: string,
      public title?: string
    ) {}

  }