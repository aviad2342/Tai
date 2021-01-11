import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { AlertController, NavController, IonContent } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ArticleService } from '../article.service';
import { AuthService } from '../../auth/auth.service';
import { Article } from '../article.model';
import { Comment } from '../comment.model';
import { AppService } from '../../app.service';
import { DomSanitizer } from '@angular/platform-browser';



@Component({
  selector: 'app-article-detail',
  templateUrl: './article-detail.page.html',
  styleUrls: ['./article-detail.page.scss'],
})
export class ArticleDetailPage implements OnInit {

  article: Article;
  @ViewChild(IonContent) content: IonContent;
  addComment = false;
  isLoading = false;
  enterTimestamp: number;
  leaveTimestamp: number;
  articleIsLoading = false;
  pdfSrc = 'http://10.0.0.1:3000/articles/1603114736179@articlepdf.pdf';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private alertController: AlertController,
    private articleService: ArticleService,
    private navController: NavController,
    private authService: AuthService,
    public sanitizer: DomSanitizer,
    public appService: AppService
  ) { }

  ngOnInit() {
    this.articleIsLoading = true;
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('id')) {
        this.navController.navigateBack('/tabs/article');
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
                    this.navController.navigateBack('/tabs/article');
                  }
                }
              ]
            })
            .then(alertEl => alertEl.present());
        }
      );
    });

  }

  ionViewDidEnter() {
    this.enterTimestamp = Date.now()/1000;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }

    this.authService.getUserLogged().subscribe(user => {
      const comment = new Comment(
        null,
        user.id,
        user.firstName + ' ' + user.lastName,
        user.profilePicture,
        form.value.body,
        new Date(),
        this.article.id,
      );
      this.articleService.addComment(comment).subscribe(newComment => {
        this.article.comments.push(newComment);
        form.reset();
        this.content.scrollToBottom(200);
      }, error => {
        form.reset();
        this.appService.presentToast('חלה תקלה התגובה לא נשמרה', false);
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

  ionViewDidLeave() {
    this.leaveTimestamp = Date.now()/1000;
    console.log(this.leaveTimestamp - this.enterTimestamp);
    console.log((this.leaveTimestamp - this.enterTimestamp)/60);
  }

}
