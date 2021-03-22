import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { jsPDF } from 'jspdf';
import { forkJoin } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AppService } from '../../../app.service';
import { Article } from '../../../article/article.model';
import { ArticleService } from '../../../article/article.service';
import '../../../../assets/JavaScript/DavidLibre-Regular-normal.js';
import '../../../../assets/JavaScript/aharoniclm-book-webfont-normal.js';
import '../../../../assets/JavaScript/Alef-Regular-normal.js';
import '../../../../assets/JavaScript/FrankRuhlLibre-Regular-normal.js';
import * as utility from '../../../utilities/functions';
import { environment } from 'src/environments/environment';

const LOCALHOST = environment.LOCALHOST;

@Component({
  selector: 'app-edit-article',
  templateUrl: './edit-article.page.html',
  styleUrls: ['./edit-article.page.scss'],
})
export class EditArticlePage implements OnInit {

  article: Article;
  @ViewChild('f', { static: true }) form: NgForm;
  @ViewChild('filePicker') filePickerRef: ElementRef<HTMLInputElement>;
  pdfFile: any;
  isLoading = false;
  htmlContent = '';
  htmlText = '';
  selectedFileUrl = '';
  viewerType = 'pdf';
  viewerStyle = 'width:100%;height:127vh;'
  fileTypeIcon = '';
  chosenFileName = '';
  articleImage;
  isPublic: boolean;
  articleIsLoading = false;
  imageIsValid = true;
  isFileChosen = false;
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
    uploadUrl: `https://${LOCALHOST}:3000/articleBodyImages/`,
    toolbarHiddenButtons: [
      ['redo'],
      ['insertImage', 'insertVideo']
    ]
  }
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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public appService: AppService,
    private alertController: AlertController,
    private articleService: ArticleService,
    private navController: NavController
  ) { }

  ngOnInit() {
    this.articleIsLoading = true;
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('id')) {
        this.navController.navigateBack('/manage/articles');
        return;
      }
      this.articleService.getArticle(paramMap.get('id')).subscribe(article => {
        this.article = article;
        this.selectedFileUrl = article.pdf;
        this.articleIsLoading = false;
        this.chosenFileName = article.pdf.split('@')[1];
        this.htmlText = article.body;
        const articleObj = {
          title:    article.title,
          subtitle: article.subtitle,
          isPublic: article.isPublic
          };
        this.form.setValue(articleObj);
      },
        error => {
          this.alertController
            .create({
              header: 'ישנה תקלה!',
              message: 'לא ניתן להציג את המאמר.',
              buttons: [
                {
                  text: 'אישור',
                  handler: () => {
                    this.navController.navigateBack(['/manage/articles']);
                  }
                }
              ]
            })
            .then(alertEl => alertEl.present());
        }
      );
    });
  }

  onPickFile() {
    this.filePickerRef.nativeElement.click();
  }

  onRermoveFile() {
    this.isFileChosen = false;
    this.filePickerRef.nativeElement.value = '';
    this.chosenFileName = '';
    this.fileTypeIcon = '';
    this.pdfFile = null;
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
    this.articleImage = imageFile;
  }

  getInput(event) {
    this.htmlText = event.target.innerText;
  }

  generateArticlePdf() {
    const title = this.form.value.title;
    const subject = this.form.value.subtitle;
    const author = this.article.authorName;
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
    if (!form.valid) {
      return;
    }
// ------------------------------------------- Thumbnail And PDF Property update -------------------------------------------------
    if (this.articleImage && this.isFileChosen) {
    const thumbnail = this.articleService.uploadArticleThumbnail(this.articleImage, 'article');
    const pdf = this.articleService.addArticlePdf(this.pdfFile, 'articlePdf');
    forkJoin([thumbnail, pdf]).pipe(switchMap(results => {
      const articleToupdate = new Article(
        this.article.id,
        this.article.authorId,
        this.article.authorName,
        this.article.catalogNumber,
        form.value.title,
        form.value.subtitle,
        this.htmlText,
        this.article.date,
        new Date(),
        results[0].imageUrl,
        results[1].fileUrl,
        this.article.views,
        this.article.comments,
        form.value.isPublic
      );
      return this.articleService.updateArticle(articleToupdate);

    })).subscribe(() => {
      this.appService.presentToast('המאמר עוכן בהצלחה', true);
      this.form.reset();
      this.navController.navigateBack(['/manage/articles']);
    }, error => {
      this.appService.presentToast('חלה תקלה פרטי המאמר לא נשמרו', false);
      this.form.reset();
      this.navController.navigateBack(['/manage/articles']);
    });
// --------------------------------------------- Thumbnail Property update ------------------------------------------------
  } else if(this.articleImage && !this.isFileChosen) {
        this.articleService.uploadArticleThumbnail(this.articleImage, 'article')
      .pipe(
        switchMap(uploadRes => {
        const articleToupdate = new Article(
          this.article.id,
          this.article.authorId,
          this.article.authorName,
          this.article.catalogNumber,
          form.value.title,
          form.value.subtitle,
          this.article.body,
          this.article.date,
          new Date(),
          uploadRes.imageUrl,
          this.article.pdf,
          this.article.views,
          this.article.comments,
          form.value.isPublic
        );
        return this.articleService.updateArticle(articleToupdate);
      }),
    ).subscribe(() => {
      this.appService.presentToast('המאמר עוכן בהצלחה', true);
      this.form.reset();
      this.navController.navigateBack(['/manage/articles']);
    }, error => {
      this.appService.presentToast('חלה תקלה פרטי המאמר לא נשמרו', false);
      this.form.reset();
      this.navController.navigateBack(['/manage/articles']);
    });
// -------------------------------------------------- PDF Property update ------------------------------------------------------
  }  else if(!this.articleImage && this.isFileChosen) {
          this.articleService.addArticlePdf(this.pdfFile, 'articlePdf')
          .pipe(
            switchMap(uploadRes => {
            const articleToupdate = new Article(
              this.article.id,
              this.article.authorId,
              this.article.authorName,
              this.article.catalogNumber,
              form.value.title,
              form.value.subtitle,
              this.htmlText,
              this.article.date,
              new Date(),
              this.article.thumbnail,
              uploadRes.fileUrl,
              this.article.views,
              this.article.comments,
              form.value.isPublic
            );
            return this.articleService.updateArticle(articleToupdate);
          }),
        ).subscribe(() => {
          this.appService.presentToast('המאמר עוכן בהצלחה', true);
          this.form.reset();
          this.navController.navigateBack(['/manage/articles']);
        }, error => {
          this.form.reset();
          this.appService.presentToast('חלה תקלה פרטי המאמר לא נשמרו', false);
          this.navController.navigateBack(['/manage/articles']);
        });
// -------------------------------------------------- No Property update ------------------------------------------------------
    } else {
      this.appService.presentToast('המאמר עוכן בהצלחה', true);
      this.form.reset();
      this.navController.navigateBack(['/manage/articles']);
    }
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
    this.navController.navigateBack(['/manage/articles']);
  }

  isEquals(article1: Article, article2: Article) {
    if(
      article1.title    === article2.title &&
      article1.subtitle === article2.subtitle &&
      article1.isPublic === article2.isPublic
    ) {
      return true;
    }
    return  false;
  }

  didEditPdf() {
    if(
      this.article.title    === this.form.value.title &&
      this.article.subtitle === this.form.value.subtitle &&
      this.article.body     === this.htmlText
    ) {
      return false;
    }
    return  true;
  }

}
