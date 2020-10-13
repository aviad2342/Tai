import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Article } from '../../../article/article.model';
import { User } from '../../../user/user.model';
import { AppService } from '../../../app.service';
import { ArticleService } from '../../../article/article.service';
import { AuthService } from '../../../auth/auth.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';

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
  selector: 'app-add-article',
  templateUrl: './add-article.page.html',
  styleUrls: ['./add-article.page.scss'],
})
export class AddArticlePage implements OnInit {

  @ViewChild('f', { static: true }) form: NgForm;
  file: File;
  author: User;
  editorConfig: AngularEditorConfig = {
    editable: true,
    height: 'auto',
    minHeight: '200px',
    maxHeight: 'auto',
    // uploadUrl: 'http://localhost:3000/articleBodyImages',
    toolbarHiddenButtons: [
      [],
      ['insertVideo']
    ]
  }

  constructor(
    private articleService: ArticleService,
    private router: Router,
    private authService: AuthService,
    public appService: AppService
    ) { }

  ngOnInit() {
    this.authService.getUserLogged().subscribe(author => {
      this.author = author;
    })
  }

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
          this.author.id,
          this.author.firstName + ' ' + this.author.lastName,
          'aa11',
          form.value.title,
          form.value.subtitle,
          form.value.body,
          new Date(),
          new Date(),
          uploadRes.imageUrl,
          0,
          []
        );
        return this.articleService.addArticle(articleToAdd);
      })
    ).subscribe(() => {
      form.reset();
      this.appService.presentToast('המאמר נשמר בהצלחה', true);
      this.router.navigate(['/manage/articles']);
    }, error => {
      form.reset();
      this.appService.presentToast('חלה תקלה פרטי המאמר לא נשמרו', false);
      this.router.navigate(['/manage/articles']);
    });
  }

  onCancel() {
    this.form.reset();
    this.appService.presentToast('הפעולה בוטלה', true);
    this.router.navigate(['/manage/articles']);
  }

}
