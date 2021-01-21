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
import { AlertController, NavController } from '@ionic/angular';
import { environment } from '../../../../environments/environment';

const LOCALHOST = environment.LOCALHOST;

@Component({
  selector: 'app-add-article',
  templateUrl: './add-article.page.html',
  styleUrls: ['./add-article.page.scss'],
})
export class AddArticlePage implements OnInit {

  @ViewChild('f', { static: true }) form: NgForm;
  @ViewChild('filePicker') filePickerRef: ElementRef<HTMLInputElement>;
  htmlText = '';
  file: File;
  pdfFile: any;
  selectedFileUrl = '';
  viewerType = 'pdf';
  viewerStyle = 'width:100%;height:127vh;'
  fileTypeIcon = '';
  chosenFileName = '';
  author: User;
  htmlContent = '';
  font: any;
  isFileChosen = false;
  imageIsValid = true;
  editorConfig: AngularEditorConfig = {
    editable: true,
    height: 'auto',
    minHeight: '200px',
    maxHeight: 'auto',
    defaultParagraphSeparator: '',
    defaultFontName: 'David',
    defaultFontSize: '10',
    fonts: [
      {class: 'DavidLibre', name: 'David'},
      {class: 'FrankRuhlLibre', name: 'Frank'},
      {class: 'aharoni', name: 'Aharoni'},
      {class: 'Alef-Regular', name: 'Alef'}
    ],
    uploadUrl: `https://${LOCALHOST}:3000/articleBodyImages/`,
    toolbarHiddenButtons: [
      ['redo'],
      ['insertVideo']
      // ['insertImage', 'insertVideo']
    ]
  };
  MIME_TYPE_MAP: object = {
    'application/pdf': 'pdf',
    'application/msword': 'doc',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx'
};

MIME_VIEWER: object = {
  'application/pdf': 'pdf',
  'application/msword': 'mammoth',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'mammoth'
};

VIEWER_STYLE: object = {
  'application/pdf': 'width:100%;height:127vh;',
  'application/msword': 'width:100%;height:auto;',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'width:100%;height:auto;'
};

MIME_TYPE_ICON: object = {
  'application/pdf': '../../../../assets/icon/pdf-icon.svg',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '../../../../assets/icon/word-icon.svg',
  'application/msword': '../../../../assets/icon/word-icon.svg'
};

  // pdfOptions: any = {
  //   documentSize: 'A4',
  //   type: 'base64',
  //   fileName: 'myFile.pdf'
  // }

  constructor(
    private articleService: ArticleService,
    private router: Router,
    private navController: NavController,
    private authService: AuthService,
    private alertController: AlertController,
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

  onPickFile() {
    this.filePickerRef.nativeElement.click();
  }

  onFileChosen(event: Event) {
    const pickedFile = (event.target as HTMLInputElement).files[0];
    this.isFileChosen = true;
    if (!pickedFile) {
      return;
    }
    if(!this.MIME_TYPE_MAP[pickedFile.type]) {
      this.onErrorImageType();
      return;
    }
    const fr = new FileReader();
    fr.onload = () => {
      const dataUrl = fr.result.toString();
      this.viewerType = this.MIME_VIEWER[pickedFile.type];
      this.viewerStyle = this.VIEWER_STYLE[pickedFile.type];
      this.selectedFileUrl = dataUrl;
      this.fileTypeIcon = this.MIME_TYPE_ICON[pickedFile.type];
      this.chosenFileName = pickedFile.name;
      this.pdfFile = pickedFile;
    };
    fr.readAsDataURL(pickedFile);
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
    this.pdfFile = pdfFile;
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
    const pdf = this.articleService.addArticlePdf(this.pdfFile, 'articlePdf');
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
      this.navController.navigateBack(['/manage/articles']);
    }, error => {
      form.reset();
      this.appService.presentToast('חלה תקלה פרטי המאמר לא נשמרו', false);
      this.navController.navigateBack(['/manage/articles']);
    });

  }

  async onErrorImageType() {
    const alert = await this.alertController.create({
      cssClass: 'error-file-type-alert',
      header: 'פורמט קובץ שגוי',
      message: `אנא בחר קובץ בפורמטים הבאים: pdf, doc, docx`,
      mode: 'ios',
      buttons: [{
          text: 'אישור',
        }
      ]
    });
    await alert.present();
}

  onCancel() {
    this.form.reset();
    this.appService.presentToast('הפעולה בוטלה', true);
    // this.router.navigate(['/manage/articles']);
    this.navController.navigateBack(['/manage/articles']);
  }

}
