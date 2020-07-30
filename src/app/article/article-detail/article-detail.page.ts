import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Article } from '../article.model';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, NavController, IonContent, IonList } from '@ionic/angular';
import { ArticleService } from '../article.service';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service';
import { Comment } from '../comment.model';

@Component({
  selector: 'app-article-detail',
  templateUrl: './article-detail.page.html',
  styleUrls: ['./article-detail.page.scss'],
})
export class ArticleDetailPage implements OnInit {

  article: Article;
  @ViewChild(IonContent) content: IonContent;
  addComment = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private alertController: AlertController,
    private articleService: ArticleService,
    private navController: NavController,
    private authService: AuthService
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
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }

    this.authService.getUserLogged().subscribe(user => {
      const comment = new Comment(
        this.article.id,
        null,
        form.value.body,
        new Date(),
        user
      );
      this.article.comments.push(comment);
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
    return this.article.author.firstName + ' ' + this.article.author.lastName;
  }

}
