import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { Coupon } from 'src/app/store/coupon.model';
import { CouponService } from 'src/app/store/coupon.service';
import { Order } from '../../../order/order.model';
import { OrderService } from '../../../order/order.service';
import { jsPDF } from 'jspdf';

@Component({
  selector: 'app-view-order',
  templateUrl: './view-order.page.html',
  styleUrls: ['./view-order.page.scss'],
})
export class ViewOrderPage implements OnInit {

  order: Order;
  coupon: Coupon;
  isLoading = false;
  useCoupon = false;
  activeUrl = '';
  @ViewChild('invoice', { static: true }) html: HTMLElement;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private alertController: AlertController,
    private navController: NavController,
    private couponService: CouponService,
    private orderService: OrderService
    ) { }

  ngOnInit() {
    this.activeUrl = this.router.url;
    this.isLoading = true;
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('id')) {
        this.navController.navigateBack('/manage/orders');
        return;
      }
      this.orderService.getOrder(paramMap.get('id')).subscribe(order => {
            this.order = order;
            if(order.couponCode && order.couponCode.length > 0) {
              this.couponService.getCoupon(order.couponCode).subscribe(coupon => {
                this.coupon = coupon;
                this.useCoupon = true;
              });
            }
            this.isLoading = false;
          },
          error => {
            if (this.router.isActive(this.activeUrl, false)) {
            this.alertController
              .create({
                header: 'ישנה תקלה!',
                message: 'לא ניתן להציג את ההזמנה.',
                buttons: [
                  {
                    text: 'אישור',
                    handler: () => {
                      if (this.router.isActive(this.activeUrl, false)) {
                        this.navController.navigateBack('/manage/orders');
                      }
                    }
                  }
                ]
              })
              .then(alertEl => alertEl.present());
            }
          }
        );
    });
  }

  generateInvoicePdf() {
    console.log(this.html);
    const doc = new jsPDF();
    // doc.setFont('David');
    doc.setR2L(true);
    // let pdfText: string;
    // pdfText = title + '\n\n' + subject + '\n\n\n' + this.htmlText;
    // const lines = doc.splitTextToSize(pdfText, 150, {A4: true});
    // doc.text(lines, 100, 10, {align:'center'});
    doc.addMetadata('<meta charset="utf-8" />');
    doc.setLanguage('he');
    // doc.setProperties({
    //   title,
    //   subject,
    //   author
    // });
    // let pdfFile;
    // pdfFile = doc.output('blob');
    const html = '';
    doc.html('https://sparksuite.github.io/simple-html-invoice-template/');
    doc.save('a4.pdf');
  }


}
