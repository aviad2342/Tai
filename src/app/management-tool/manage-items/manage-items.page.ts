import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ColumnMode, DatatableComponent, SelectionType } from '../../../../projects/swimlane/ngx-datatable/src/public-api';
import { Subscription } from 'rxjs';
import { AppService } from '../../../app/app.service';
import { Item } from '../../../app/store/item.model';
import { ItemService } from '../../../app/store/item.service';

@Component({
  selector: 'app-manage-items',
  templateUrl: './manage-items.page.html',
  styleUrls: ['./manage-items.page.scss'],
})
export class ManageItemsPage implements OnInit, OnDestroy {

  items: Item[];
  selectedItemId;
  private itemSubscription: Subscription;
   @ViewChild('itemsTable') itemsTable: DatatableComponent;
  isRowSelected = false;
  columnMode = ColumnMode;
  SelectionType = SelectionType;
  temp = [];
  selected = [];

  categories = {
    BOOKS: 'ספרים',
    TREATMENTS: 'טיפולים',
    CONFERENCES: 'כנסים',
    COURSES: 'קורסים',
    ARTICLES: 'מאמרים',
    ACCESSORIES: 'אביזרים',
    OTHER: 'אחר'
  };


  constructor(
    private itemService: ItemService,
    private alertController: AlertController,
    private router: Router,
    private appservice: AppService
    ) { }

    ngOnInit() {
      this.itemSubscription = this.itemService.items.subscribe(items => {
        this.items = items;
        this.temp = [...this.items];
      });
    }

    ionViewWillEnter() {
      this.itemService.getItems().subscribe(items => {
        if(this.selectedItemId  && this.selectedItemId !== '' && this.selectedItemId !== null) {
          this.selected = [];
          const item = items.find(i => i.id === this.selectedItemId);
          this.selected.push(item);
        }
      });
    }

   onFilterCategories(event) {
    this.selectedItemId = null;
    this.isRowSelected = false;
    this.selected = [];
    const val = event.target.value.toLowerCase();
    const temp = this.temp.filter((d)=> {
      return d.category.toLowerCase().indexOf(val) !== -1 || !val;
     });
   this.items = temp;
    }

    filterItems(event) {
      this.selectedItemId = null;
      this.isRowSelected = false;
      this.selected = [];
      const val = event.target.value.toLowerCase();
      const temp = this.temp.filter((d)=> {
        return d.name.toLowerCase().indexOf(val) !== -1 || !val;
       });
     this.items = temp;
      }

  async onAddItem() {
    this.selectedItemId = null;
    this.isRowSelected = false;
    this.selected = [];
    this.router.navigate(['manage', 'items', 'new']);
  }

  async onViewItem() {
    this.router.navigate(['manage', 'items', 'view', this.selectedItemId]);
  }

  async onEditItem() {
    this.router.navigate(['manage', 'items', 'edit', this.selectedItemId]);
  }

  async onDeleteItem() {
      const alert = await this.alertController.create({
        cssClass: 'delete-item-alert',
        header: 'אישור מחיקת מוצר',
        message: `האם אתה בטוח שברצונך למחוק את המוצר לצמיתות?`,
        mode: 'ios',
        buttons: [
          {
            text: 'ביטול',
            role: 'cancel',
            cssClass: 'delete-item-alert-btn-cancel',
            handler: () => {
            }
          }, {
            text: 'אישור',
            handler: () => {
              this.itemService.deleteItem(this.selectedItemId).subscribe( () => {
                this.isRowSelected = false;
                this.selectedItemId = null;
                this.selected = [];
                this.appservice.presentToast('המוצר נמחק בהצלחה!', true);
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
    if(this.selectedItemId === selected[0].id) {
      this.selected = [];
      this.selectedItemId = '';
      this.isRowSelected = false;
    } else {
      this.isRowSelected = true;
      this.selectedItemId = selected[0].id;
    }
  }

  onActivate(event) {
    // console.log('Activate Event', event);
  }

  ngOnDestroy() {
    if (this.itemSubscription) {
      this.itemSubscription.unsubscribe();
    }
  }

}
