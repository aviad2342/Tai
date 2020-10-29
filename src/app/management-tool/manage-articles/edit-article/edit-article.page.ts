import { Component, OnInit, ViewChild } from '@angular/core';
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

@Component({
  selector: 'app-edit-article',
  templateUrl: './edit-article.page.html',
  styleUrls: ['./edit-article.page.scss'],
})
export class EditArticlePage implements OnInit {

  article: Article;
  @ViewChild('f', { static: true }) form: NgForm;
  isLoading = false;
  htmlContent = '';
  htmlText = '';
  articleImage;
  articleIsLoading = false;
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
        this.articleIsLoading = false;
        this.htmlText = article.body;
        const articleObj = {
          title:    article.title,
          subtitle: article.subtitle,
          body:     article.body // mybe replace with html content
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
                    this.router.navigate(['/manage/articles']);
                  }
                }
              ]
            })
            .then(alertEl => alertEl.present());
        }
      );
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
    if (this.articleImage && this.didEditPdf()) {
    const thumbnail = this.articleService.uploadArticleThumbnail(this.articleImage, 'article');
    const pdf = this.articleService.addArticlePdf(this.generateArticlePdf(), 'articlePdf');
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
        this.article.comments
      );
      return this.articleService.updateArticle(articleToupdate);

    })).subscribe(() => {
      this.appService.presentToast('המאמר עוכן בהצלחה', true);
      this.form.reset();
      this.router.navigate(['/manage/articles']);
    }, error => {
      this.appService.presentToast('חלה תקלה פרטי המאמר לא נשמרו', false);
      this.form.reset();
      this.router.navigate(['/manage/articles']);
    });
// --------------------------------------------- Thumbnail Property update ------------------------------------------------
  } else if(this.articleImage && !this.didEditPdf()) {
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
          this.article.comments
        );
        return this.articleService.updateArticle(articleToupdate);
      }),
    ).subscribe(() => {
      this.appService.presentToast('המאמר עוכן בהצלחה', true);
      this.form.reset();
      this.router.navigate(['/manage/articles']);
    }, error => {
      this.appService.presentToast('חלה תקלה פרטי המאמר לא נשמרו', false);
      this.form.reset();
      this.router.navigate(['/manage/articles']);
    });
// -------------------------------------------------- PDF Property update ------------------------------------------------------
  }  else if(!this.articleImage && this.didEditPdf()) {
          this.articleService.addArticlePdf(this.generateArticlePdf(), 'articlePdf')
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
              this.article.comments
            );
            return this.articleService.updateArticle(articleToupdate);
          }),
        ).subscribe(() => {
          this.appService.presentToast('המאמר עוכן בהצלחה', true);
          this.form.reset();
          this.router.navigate(['/manage/articles']);
        }, error => {
          this.form.reset();
          this.appService.presentToast('חלה תקלה פרטי המאמר לא נשמרו', false);
          this.router.navigate(['/manage/articles']);
        });
// -------------------------------------------------- No Property update ------------------------------------------------------
    } else {
      this.appService.presentToast('המאמר עוכן בהצלחה', true);
      this.form.reset();
        this.router.navigate(['/manage/articles']);
    }


  }

  onCancel() {
    this.form.reset();
    this.appService.presentToast('הפעולה בוטלה', true);
    this.router.navigate(['/manage/articles']);
  }

  isEquals(article1: Article, article2: Article) {
    if(
      article1.title    === article2.title &&
      article1.subtitle === article2.subtitle
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
