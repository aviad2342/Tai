import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ArticleService } from '../article.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AppService } from '../../app.service';
import { NavController } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Article } from '../article.model';
import { switchMap } from 'rxjs/operators';

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
export class EditArticlePage implements OnInit, OnDestroy {

  article: Article;
  id: string;
  @ViewChild('f', { static: true }) form: NgForm;
  private articleSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private articleService: ArticleService,
    private router: Router,
    private navCtrl: NavController,
    public appService: AppService
    ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('id')) {
        this.navCtrl.navigateBack('/tabs/article');
        return;
      }
      this.id = paramMap.get('id');
      this.articleSubscription = this.articleService.getArticle(paramMap.get('id')).
      subscribe(article => {
        this.article = article;
        const articleObj = {
          title: this.article.title,
          subtitle: this.article.subtitle,
          body: this.article.body
          };
        this.form.setValue(articleObj);
      });
    });
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
    this.form.value.image = imageFile;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    if (form.value.image) {
      this.articleService.uploadArticleThumbnail(this.form.value.image, 'article')
    .pipe(
      switchMap(uploadRes => {
        const articleToUpdate = new Article(
          this.id,
          this.article.authorId,
          this.article.authorName,
          this.article.catalogNumber,
          form.value.title,
          form.value.subtitle,
          form.value.body,
          this.article.date,
          new Date(),
          uploadRes.imageUrl,
          this.article.views,
          this.article.comments
        );
        return this.articleService.updateArticle(articleToUpdate);
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

    } else {
      const articleToUpdate = new Article(
        this.id,
        this.article.authorId,
        this.article.authorName,
        this.article.catalogNumber,
        form.value.title,
        form.value.subtitle,
        form.value.body,
        this.article.date,
        new Date(),
        this.article.thumbnail,
        this.article.views,
        this.article.comments
      );
      if(this.isEquals(this.article, articleToUpdate)) {
        this.appService.presentToast('המאמר נשמר בהצלחה', true);
        this.router.navigate(['/tabs/article']);
        return;
      }
      this.articleService.updateArticle(articleToUpdate).subscribe(() => {
        this.appService.presentToast('המאמר נשמר בהצלחה', true);
        this.router.navigate(['/tabs/article']);
    }, error => {
        this.appService.presentToast('חלה תקלה פרטי המאמר לא נשמרו', false);
        this.router.navigate(['/tabs/article']);
      });
    }

  }

  isEquals(article1: Article, article2: Article) {
    if(
      article1.title    === article2.title &&
      article1.subtitle === article2.subtitle &&
      article1.body     === article2.body
    ) {
      return true;
    }
    return  false;
  }

  onCancel() {
    this.appService.presentToast('הפעולה בוטלה', true);
    this.router.navigate(['/tabs/article']);
  }

  ngOnDestroy() {
    if (this.articleSubscription) {
      this.articleSubscription.unsubscribe();
    }
  }

}
