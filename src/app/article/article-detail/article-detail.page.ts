import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { AlertController, NavController, IonContent, IonList } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Subscription, interval } from 'rxjs';
import { flatMap, switchMap, map } from 'rxjs/operators';
import { UserService } from 'src/app/user/user.service';
import { ArticleService } from '../article.service';
import { AuthService } from 'src/app/auth/auth.service';
import { Article } from '../article.model';
import { Comment } from '../comment.model';
import { User } from 'src/app/user/user.model';


@Component({
  selector: 'app-article-detail',
  templateUrl: './article-detail.page.html',
  styleUrls: ['./article-detail.page.scss'],
})
export class ArticleDetailPage implements OnInit, OnDestroy {

  article: Article;
  articleId = '';
  comments: Comment[];
  @ViewChild(IonContent) content: IonContent;
  private commentSub: Subscription;
  author: User;
  addComment = false;
  isLoading = false;
  articleIsLoading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private alertController: AlertController,
    private articleService: ArticleService,
    private navController: NavController,
    private authService: AuthService,
    private userService: UserService
    ) { }

  ngOnInit() {
    this.articleIsLoading = true;
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('id')) {
        this.navController.navigateBack('/tabs/article');
        return;
      }
      this.articleId = paramMap.get('id');
      this.articleService.getArticle(paramMap.get('id')).subscribe(article => {
            this.article = article;
            this.userService.getUser(this.article?.authorId).subscribe(user => {
              this.author = user;
              this.articleIsLoading = false;
            });
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
                      this.router.navigate(['/tabs/article']);
                    }
                  }
                ]
              })
              .then(alertEl => alertEl.present());
          }
        );
      this.commentSub = this.articleService.getArticleComments(paramMap.get('id')).subscribe(comments => {
          this.comments = comments;
        });
    });

}

ionViewWillEnter() {
  this.isLoading = true;
  this.articleService.getArticleComments(this.articleId).subscribe(() => {
    this.isLoading = false;
  });
}

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }

    this.authService.getUserLogged().subscribe(user => {
      const comment = new Comment(
        null,
        this.article.id,
        user.id,
        form.value.body,
        new Date()
      );
      this.articleService.addComment(comment).subscribe(newComment => {
        this.comments.push(comment);
        form.reset();
        this.content.scrollToBottom(200);
      });
    });
    this.content.scrollToBottom(200);
  }

   getContent() {
    return document.querySelector('ion-content');
  }

   scrollToBottom() {
    this.getContent().scrollToBottom(500);
  }
  showForm() {
     this.addComment = true;
  }

  getAuthorFullName() {
    return this.author?.firstName + ' ' + this.author?.lastName;
  }

  ngOnDestroy() {
    if (this.commentSub) {
      this.commentSub.unsubscribe();
    }
  }

}
