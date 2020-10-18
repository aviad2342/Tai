import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { ColumnMode, DatatableComponent, SelectionType } from 'projects/swimlane/ngx-datatable/src/public-api';
import { Subscription } from 'rxjs';
import { AppService } from '../../app.service';
import { Article } from '../../article/article.model';
import { ArticleService } from '../../article/article.service';

@Component({
  selector: 'app-manage-articles',
  templateUrl: './manage-articles.page.html',
  styleUrls: ['./manage-articles.page.scss'],
})
export class ManageArticlesPage implements OnInit, OnDestroy {

  articles: Article[];
  selectedArticleId;
  private articleSubscription: Subscription;
   @ViewChild('coursesTable') coursesTable: DatatableComponent;
  isRowSelected = false;
  columnMode = ColumnMode;
  SelectionType = SelectionType;
  temp = [];
  selected = [];


  constructor(
    private articleService: ArticleService,
    private modalController: ModalController,
    private alertController: AlertController,
    private router: Router,
    private appservice: AppService
    ) { }

  ngOnInit() {
    this.articleSubscription = this.articleService.articles.subscribe(articles => {
      this.articles = articles;
      this.temp = [...this.articles];
    });
  }

  ionViewWillEnter() {
    this.articleService.getArticles().subscribe(articles => {
      if(this.selectedArticleId  && this.selectedArticleId !== '' && this.selectedArticleId !== null) {
        this.selected = [];
        const article = articles.find(e => e.id === this.selectedArticleId);
        this.selected.push(article);
      }
    });
  }

  filterArticle(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.temp.filter((a)=> {
      return a.title.toLowerCase().indexOf(val) !== -1 || !val;
     });
   this.articles = temp;
    }

  async onAddArticle() {
    this.selectedArticleId = null;
    this.isRowSelected = false;
    this.selected = [];
    this.router.navigate(['manage', 'articles', 'new']);
  }

  async onViewArticle() {
    this.router.navigate(['manage', 'articles', 'view', this.selectedArticleId]);
  }

  async onEditArticle() {
    this.router.navigate(['manage', 'articles', 'edit', this.selectedArticleId]);
  }

  async onDeleteArticle() {
      const alert = await this.alertController.create({
        cssClass: 'delete-article-alert',
        header: 'אישור מחיקת מאמר',
        message: `האם אתה בטוח שברצונך למחוק את המאמר לצמיתות?`,
        mode: 'ios',
        buttons: [
          {
            text: 'ביטול',
            role: 'cancel',
            cssClass: 'delete-article-alert-btn-cancel',
            handler: () => {
            }
          }, {
            text: 'אישור',
            handler: () => {
              this.articleService.deleteArticle(this.selectedArticleId).subscribe( () => {
                this.isRowSelected = false;
                this.selectedArticleId = null;
                this.selected = [];
                this.appservice.presentToast('המאמר נמחק בהצלחה!', true);
              }, error => {
                this.appservice.presentToast('חלה תקלה פעולת המחיקה נכשלה!', false);
              });
            }
          }
        ]
      });
      await alert.present();
  }

  onSelect({ selected }) {
    if(this.selectedArticleId === selected[0].id) {
      this.selected = [];
      this.selectedArticleId = '';
      this.isRowSelected = false;
    } else {
      this.isRowSelected = true;
      this.selectedArticleId = selected[0].id;
    }
  }


  ngOnDestroy() {
    if (this.articleSubscription) {
      this.articleSubscription.unsubscribe();
    }
  }

}
