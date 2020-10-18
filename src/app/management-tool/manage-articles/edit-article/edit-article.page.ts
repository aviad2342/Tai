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
  bodyText = '';
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
    this.form.value.image = imageFile;
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
    this.bodyText = pdfText;
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
    if (this.form.value.image && this.didEditPdf()) {
    const thumbnail = this.articleService.uploadArticleThumbnail(this.form.value.image, 'article');
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
      return this.articleService.updateArticleThumbnail(articleToupdate);

    })).subscribe(() => {
      this.appService.presentToast('המאמר עוכן בהצלחה', true);
      this.router.navigate(['/manage/articles']);
    }, error => {
      this.appService.presentToast('חלה תקלה פרטי המאמר לא נשמרו', false);
      this.router.navigate(['/manage/articles']);
    });
// --------------------------------------------- Thumbnail Property update ------------------------------------------------
  } else if(this.form.value.image && this.didEditPdf() === false) {
        this.articleService.uploadArticleThumbnail(this.form.value.image, 'article')
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
        return this.articleService.updateArticleThumbnail(articleToupdate);
      }),
    ).subscribe(() => {
      this.appService.presentToast('המאמר עוכן בהצלחה', true);
      this.router.navigate(['/manage/articles']);
    }, error => {
      this.appService.presentToast('חלה תקלה פרטי המאמר לא נשמרו', false);
      this.router.navigate(['/manage/articles']);
    });
// -------------------------------------------------- Thumbnail Property update ------------------------------------------------------
  }  else if(!this.form.value.image && this.didEditPdf()) {
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
          this.router.navigate(['/manage/articles']);
        }, error => {
          this.appService.presentToast('חלה תקלה פרטי המאמר לא נשמרו', false);
          this.router.navigate(['/manage/articles']);
        });
// -------------------------------------------------- No Property update ------------------------------------------------------
    } else {
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
        this.article.thumbnail,
        this.article.pdf,
        this.article.views,
        this.article.comments
      );

      if(this.isEquals(this.article, articleToupdate)) {
        this.appService.presentToast('המאמר עוכן בהצלחה', true);
        this.router.navigate(['/manage/articles']);
      }
      this.articleService.updateArticle(articleToupdate).subscribe(() => {
        this.appService.presentToast('המאמר עוכן בהצלחה', true);
        this.router.navigate(['/manage/articles']);
      }, error => {
        this.appService.presentToast('חלה תקלה פרטי המאמר לא נשמרו', false);
        this.router.navigate(['/manage/articles']);
      });
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
