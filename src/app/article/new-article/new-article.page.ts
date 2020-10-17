import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ArticleService } from '../article.service';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Article } from '../article.model';
import { AuthService } from '../../auth/auth.service';
import { AppService } from '../../app.service';
import { QuillFormat, QuillEditorBase, QuillEditorComponent } from 'ngx-quill';


function base64toBlob(base64Data, contentType) {
  contentType = contentType || '';
  const sliceSize = 1024;
  const byteCharacters = window.atob(base64Data);
  const bytesLength = byteCharacters.length;
  const slicesCount = Math.ceil(bytesLength / sliceSize);
  const byteArrays = new Array(slicesCount);

  for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
    const begin = sliceIndex * sliceSize;
    const end = Math.min(begin + sliceSize, bytesLength);

    const bytes = new Array(end - begin);
    for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
      bytes[i] = byteCharacters[offset].charCodeAt(0);
    }
    byteArrays[sliceIndex] = new Uint8Array(bytes);
  }
  return new Blob(byteArrays, { type: contentType });
}

@Component({
  selector: 'app-new-article',
  templateUrl: './new-article.page.html',
  styleUrls: ['./new-article.page.scss'],
})
export class NewArticlePage implements OnInit {

  @ViewChild('f', { static: true }) form: NgForm;
  @ViewChild('#quillEditor', { static: true }) quillEditor: QuillEditorComponent;
  file: File;
  authorId: string;
  authorName: string;

  modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
      ['blockquote', 'code-block'],

      [{ header: 1 }, { header: 2 }],               // custom button values
      [{ list: 'ordered'}, { list: 'bullet' }],
      [{ script: 'sub'}, { script: 'super' }],      // superscript/subscript
      [{ indent: '-1'}, { indent: '+1' }],          // outdent/indent
      [{ direction: 'rtl' }, { align: [] }],                         // text direction

      [{ size: ['small', false, 'large', 'huge'] }],  // custom dropdown
      [{ header: [1, 2, 3, 4, 5, 6, false] }],

      [{ color: [] }, { background: [] }],          // dropdown with defaults from theme
      [{ font: [] }],
      [{ align: [] }],

      ['clean'],                                         // remove formatting button

      ['link', 'image', 'video']                         // link and image, video
    ]
  };


  constructor(
    private articleService: ArticleService,
    private router: Router,
    private authService: AuthService,
    public appService: AppService
    ) { }

    rtl(event: Event){
      console.log(event);

    }
  ngOnInit() {

    // this.quillEditor.format('direction','rtl');
    this.authService.getUserLogged().subscribe(author => {
      this.authorId = author.id;
      this.authorName = author.firstName + ' ' + author.lastName;
    })
  }

  // ionViewDidEnter() {
  //   const elem = this.quillEditor.editorElem.getElementsByClassName('ql-blank')[0];
  //   const child = elem.children[0];
  //   child.classList.add('ql-align-right');
  // }

  onImagePicked(imageData: string | File) {
    let imageFile;
    if (typeof imageData === 'string') {
      try {
        imageFile = base64toBlob(
          imageData.replace('data:image/jpeg;base64,', ''),
          'image/jpeg'
        );
      } catch (error) {
        console.log(error);
        return;
      }
    } else {
      imageFile = imageData;
    }
    this.file = imageFile;
    this.form.value.image = imageFile;
  }

  onSubmit(form: NgForm) {
    form.value.image = this.file;
    if (!form.valid || !this.form.value.image) {
      return;
    }
    this.articleService.uploadArticleThumbnail(this.form.value.image, 'article')
    .pipe(
      switchMap(uploadRes => {
        const articleToAdd = new Article(
          null,
          this.authorId,
          this.authorName,
          'aa11',
          form.value.title,
          form.value.subtitle,
          form.value.body,
          new Date(),
          new Date(),
          uploadRes.imageUrl,
          'PDF',
          0,
          []
        );
        return this.articleService.addArticle(articleToAdd);
      })
    ).subscribe(() => {
      form.reset();
      this.appService.presentToast('המאמר נשמר בהצלחה', true);
      this.router.navigate(['/tabs/article']);
    }, error => {
      form.reset();
      this.appService.presentToast('חלה תקלה פרטי המאמר לא נשמרו', false);
      this.router.navigate(['/tabs/article']);
    });
  }

}
