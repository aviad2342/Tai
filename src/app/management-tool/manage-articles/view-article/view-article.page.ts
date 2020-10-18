import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { Article } from '../../../article/article.model';
import { ArticleService } from '../../../article/article.service';


@Component({
  selector: 'app-view-article',
  templateUrl: './view-article.page.html',
  styleUrls: ['./view-article.page.scss'],
})
export class ViewArticlePage implements OnInit {

  article: Article;
  // @ViewChild(IonContent) content: IonContent;
  isLoading = false;
  articleIsLoading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private alertController: AlertController,
    private articleService: ArticleService,
    public sanitizer: DomSanitizer,
    private navController: NavController
  ) { }

  ngOnInit() {
    this.articleIsLoading = true;
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('id')) {
        this.navController.navigateBack('/manage/articles');
        return;
      }
      this.articleService.viewArticle(paramMap.get('id')).subscribe(article => {
        this.article = article;
        this.articleIsLoading = false;
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

}
