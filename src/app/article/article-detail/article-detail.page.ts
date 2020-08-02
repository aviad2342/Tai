import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Article } from '../article.model';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, NavController, IonContent, IonList } from '@ionic/angular';
import { ArticleService } from '../article.service';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service';
import { Comment } from '../comment.model';
import { UserService } from 'src/app/user/user.service';
import { User } from 'src/app/user/user.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-article-detail',
  templateUrl: './article-detail.page.html',
  styleUrls: ['./article-detail.page.scss'],
})
export class ArticleDetailPage implements OnInit, OnDestroy {

  article: Article;
  comments: Comment[];
  @ViewChild(IonContent) content: IonContent;
  author: User;
  private commentsSub: Subscription;
  addComment = false;

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
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('id')) {
        this.navController.navigateBack('/tabs/article');
        return;
      }
      this.articleService.getArticle(paramMap.get('id')).subscribe(article => {
            this.article = article;
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
    });
    this.userService.getUser(this.article.authorId).subscribe(user => {
      this.author = user;
    });
    this.commentsSub = this.articleService.getComments(this.article.id).subscribe(comments => {
      this.comments = comments;
      console.log(this.comments);
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
      this.comments.push(comment);
      form.reset();
      this.content.scrollToBottom(200);
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
    if (this.commentsSub) {
      this.commentsSub.unsubscribe();
    }
  }

}
