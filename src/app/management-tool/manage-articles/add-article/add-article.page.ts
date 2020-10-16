import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Article } from '../../../article/article.model';
import { User } from '../../../user/user.model';
import { AppService } from '../../../app.service';
import { ArticleService } from '../../../article/article.service';
import { AuthService } from '../../../auth/auth.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
// import { PDFGenerator } from '@ionic-native/pdf-generator/ngx';
// import * as jsPDF from 'jspdf'
// import * as Davidd from '../../../../assets/JavaScript/DavidLibre-Regular-normal.js'
import '../../../../assets/JavaScript/DavidLibre-Regular-normal.js';
import { jsPDF } from 'jspdf';


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
  htmlContent = '';
  font: any;
  imageIsValid = true;
  editorConfig: AngularEditorConfig = {
    editable: true,
    height: 'auto',
    minHeight: '200px',
    maxHeight: 'auto',
    // defaultParagraphSeparator: 'tr',
    defaultFontName: 'David',
    fonts: [
      {class: 'arial', name: 'Arial'},
      {class: 'times-new-roman', name: 'Times New Roman'},
      {class: 'calibri', name: 'Calibri'},
      {class: 'DavidLibre', name: 'David'},
      {class: 'dragon', name: 'Dragon'},
      {class: 'aharoni', name: 'Aharoni'},
      {class: 'comic-sans-ms', name: 'Comic Sans MS'}
    ],
    uploadUrl: 'http://localhost:3000/articleBodyImages/',
    toolbarHiddenButtons: [
      ['redo'],
      ['insertImage', 'insertVideo']
    ]
  }

  // pdfOptions: any = {
  //   documentSize: 'A4',
  //   type: 'base64',
  //   fileName: 'myFile.pdf'
  // }

  constructor(
    private articleService: ArticleService,
    private router: Router,
    private authService: AuthService,
    public appService: AppService
    ) { }

  ngOnInit() {
    this.authService.getUserLogged().subscribe(author => {
      this.author = author;
    });
  }

  onImagePicked(imageData: string | File) {
    this.imageIsValid = true;
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

  readHtml() {
    console.log(this.htmlContent);
      const title = this.form.value.title;
      const subject = this.form.value.subtitle;
      const author = this.author.firstName + ' ' + this.author.lastName;
      const doc = new jsPDF();
      doc.setFont('David');
      const text = ' יודע באיזו עמדה להציב אותו בנבחרת, ואמר: כל אחד רשאי להגיד מה שהוא רוצה. אין לי בעיה עם אנטואן, אבל אני המאמן ואני חושב על טובת הקבוצה. אי אפשר לשנים. חוץ מזה, מדובר בשחקן שנהיההוא ווינר ותמריך חזרה';
      doc.setR2L(true);
      const lines = doc.splitTextToSize(text, 100, {A4: true});
      doc.text(lines, 100, 10, {align:'center'});
      doc.addMetadata('<meta charset="utf-8" />');
      doc.setLanguage('he');
      // doc.html(this.htmlContent).then(bla => {
      //   bla.
      // });
      // doc.text([...text].reverse().join(''), 200, 20);
      doc.setProperties({
        title,
        subject,
        author
      });
      let pdfFile;
          pdfFile = doc.output('blob');
          console.log(pdfFile);
          this.articleService.addArticlePdf(pdfFile, 'article').subscribe(resData => {
            console.log(resData.fileUrl);
          }, error => {
            console.log(error);
          });

      doc.save('ddgcd.pdf');
  }

  onSubmit(form: NgForm) {
    form.value.image = this.file;
    if (!form.valid) {
      return;
    }
    if (!this.form.value.image) {
      this.imageIsValid = false;
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
        // this.pdfGenerator.fromData(form.value.body, this.pdfOptions)
        // .then(base64=> {
        //   let pdfFile;
        //   pdfFile = base64toBlob(base64, 'application/pdf');
        //   this.articleService.addArticlePdf(pdfFile, 'articlePdf').subscribe(resData => {
        //     console.log(resData.fileUrl);
        //   });
        // })
        // .catch((err)=>console.log(err));
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
