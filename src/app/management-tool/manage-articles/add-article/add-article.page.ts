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
import '../../../../assets/JavaScript/aharoniclm-book-webfont-normal.js';
import '../../../../assets/JavaScript/Alef-Regular-normal.js';
import '../../../../assets/JavaScript/FrankRuhlLibre-Regular-normal.js';
import { jsPDF } from 'jspdf';
import { forkJoin } from 'rxjs';
import * as utility from '../../../utilities/functions';


@Component({
  selector: 'app-add-article',
  templateUrl: './add-article.page.html',
  styleUrls: ['./add-article.page.scss'],
})
export class AddArticlePage implements OnInit {

  @ViewChild('f', { static: true }) form: NgForm;
  htmlText = '';
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
    defaultParagraphSeparator: '',
    defaultFontName: 'David',
    defaultFontSize: '4',
    fonts: [
      {class: 'DavidLibre', name: 'David'},
      {class: 'FrankRuhlLibre', name: 'Frank'},
      {class: 'aharoni', name: 'Aharoni'},
      {class: 'Alef-Regular', name: 'Alef'}
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
        imageFile = utility.base64toBlob(
          imageData.replace('data:image/jpeg;base64,', ''),
          'image/jpeg'
        );
      } catch (error) {
        this.appService.presentToast('חלה תקלה לא ניתן לשמור את התמונה!', false);
        return;
      }
    } else {
      imageFile = imageData;
    }
    this.file = imageFile;
    this.form.value.image = imageFile;
  }

  getInput(event) {
    this.htmlText = event.target.innerText;
  }

  readHtml() {
    //  console.log(this.htmlText);
    //   const title = this.form.value.title;
    //   const subject = this.form.value.subtitle;
    //   const author = this.author.firstName + ' ' + this.author.lastName;
    //   const doc = new jsPDF();
    //   doc.setFont('David');
    //   doc.setR2L(true);
    //   let pdfText: string;
    //   pdfText = title + '\n\n' + subject + '\n\n\n' + this.htmlText;
    //   const lines = doc.splitTextToSize(pdfText, 150, {A4: true});
    //   doc.text(lines, 100, 10, {align:'center'});
    //   doc.addMetadata('<meta charset="utf-8" />');
    //   doc.setLanguage('he');
    //   // doc.html(txt, {callback: pdf => {
    //   //   pdf.setFontSize(10);
    //   //   pdf.save(title);
    //   // }, x: 10, y: 10 } );
    //   // doc.html(this.htmlContent).then(bla => {
    //   //   bla.
    //   // });
    //   // doc.text([...text].reverse().join(''), 200, 20);
    //   doc.setProperties({
    //     title,
    //     subject,
    //     author
    //   });
    //   let pdfFile;
    //       pdfFile = doc.output('blob');
    //       console.log(pdfFile);
    //       this.articleService.addArticlePdf(pdfFile, 'article').subscribe(resData => {
    //         console.log(resData.fileUrl);
    //       }, error => {
    //         console.log(error);
    //       });

    //   doc.save(title);
  }

  generateArticlePdf() {
    const title = this.form.value.title;
    const subject = this.form.value.subtitle;
    const author = this.author.firstName + ' ' + this.author.lastName;
    const doc = new jsPDF();
    doc.setFont('David');
    doc.setR2L(true);
    let pdfText: string;
    pdfText = title + '\n\n' + subject + '\n\n\n' + this.htmlText;
    const lines = doc.splitTextToSize(pdfText, 150, {A4: true});
    doc.text(lines, 100, 10, {align:'center'});
    doc.addMetadata('<meta charset="utf-8" />');
    doc.setLanguage('he');
    doc.setProperties({
      title,
      subject,
      author
    });
    let pdfFile;
    pdfFile = doc.output('blob');
    return pdfFile;
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
    const thumbnail = this.articleService.uploadArticleThumbnail(this.form.value.image, 'article');
    const pdf = this.articleService.addArticlePdf(this.generateArticlePdf(), 'articlePdf');
    forkJoin([thumbnail, pdf]).pipe(switchMap(results => {
      const articleToAdd = new Article(
        null,
        this.author.id,
        this.author.firstName + ' ' + this.author.lastName,
        'aa11',
        form.value.title,
        form.value.subtitle,
        this.htmlText,
        new Date(),
        new Date(),
        results[0].imageUrl,
        results[1].fileUrl,
        0,
        []
      );
      return this.articleService.addArticle(articleToAdd);

    })).subscribe(() => {
      form.reset();
      this.appService.presentToast('המאמר נשמר בהצלחה', true);
      this.router.navigate(['/manage/articles']);
    }, error => {
      form.reset();
      this.appService.presentToast('חלה תקלה פרטי המאמר לא נשמרו', false);
      this.router.navigate(['/manage/articles']);
    });


    // this.articleService.uploadArticleThumbnail(this.form.value.image, 'article')
    // .pipe(
    //   switchMap(uploadRes => {
    //     const articleToAdd = new Article(
    //       null,
    //       this.author.id,
    //       this.author.firstName + ' ' + this.author.lastName,
    //       'aa11',
    //       form.value.title,
    //       form.value.subtitle,
    //       form.value.body,
    //       new Date(),
    //       new Date(),
    //       uploadRes.imageUrl,
    //       'PDF',
    //       0,
    //       []
    //     );
    //     return this.articleService.addArticle(articleToAdd);
    //   }),
    // ).subscribe(() => {
    //   form.reset();
    //   this.appService.presentToast('המאמר נשמר בהצלחה', true);
    //   this.router.navigate(['/manage/articles']);
    // }, error => {
    //   form.reset();
    //   this.appService.presentToast('חלה תקלה פרטי המאמר לא נשמרו', false);
    //   this.router.navigate(['/manage/articles']);
    // });
  }

  onCancel() {
    this.form.reset();
    this.appService.presentToast('הפעולה בוטלה', true);
    this.router.navigate(['/manage/articles']);
  }

}
