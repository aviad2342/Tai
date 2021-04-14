import { Component, ElementRef, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { Coupon } from '../../../store/coupon.model';
import { CouponService } from '../../../store/coupon.service';
import { Order } from '../../../order/order.model';
import { OrderService } from '../../../order/order.service';
import { jsPDF } from 'jspdf';
// import { html2canvas } from 'html2canvas';
// import * as jspdf from 'jspdf';
// import * as html2canvas from 'html2canvas';
// import * as html2canvas from 'html2canvas';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;


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
  letterObj = {
    to: '',
    from: '',
    text: ''
  }
  pdfObj = null;

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

  createPdf() {
    this.letterObj.from = 'bla';
    this.letterObj.to = this?.order.user.firstName + ' ' + this?.order.user.lastName;
    this.letterObj.text = 'dvvsdv gergeg ht htrhrth hrthrth rthrthrth rth';
    const fonts = (pdfMake as any).fonts = {
      Yoav: {
        normal: 'Yoav.TTF',
        bold: 'Yoav-bold.TTF',
      },
      Roboto: {
        normal: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf',
        bold: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Medium.ttf',
        italics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Italic.ttf',
        bolditalics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-MediumItalic.ttf'
      }
   }
    const docDefinition: TDocumentDefinitions = {
      content: [
        { text: 'REMINDER', style: 'header' },
        { text: new Date().toUTCString(), alignment: 'right' },

        { text: 'From', style: 'subheader' },
        { text: this.letterObj.from },

        { text: 'To', style: 'subheader' },
        this.letterObj.to,

        { text: this.letterObj.text, style: 'story', margin: [0, 20, 0, 20] },

        {
          ul: [
            'Bacon',
            'Rips',
            'BBQ',
          ]
        }
      ],
      styles: {
        with: {},
        header: {
          fontSize: 18,
          bold: true,
        },
        subheader: {
          font: 'Yoav',
          fontSize: 14,
          bold: false,
          margin: [0, 15, 0, 0]
        },
        story: {
          italics: true,
          alignment: 'center'
        }
      }
    }
    this.pdfObj = pdfMake.createPdf(docDefinition, null, fonts);
  }

  downloadPdf() {
    this.pdfObj.download();
  }

  // generateInvoicePdf() {
  //   const doc = new jsPDF('p', 'mm', 'a4');
  //   doc.setR2L(true);
  //   doc.addMetadata('<meta charset="utf-8" />');
  //   doc.setLanguage('he');
  //   const html = document.getElementById('invoice').innerText;
  //   const lines = doc.splitTextToSize(html, 150, {A4: true});
  //   doc.text(lines, 100, 10, {align:'center'});
  //   doc.html(this.container);
  //   doc.save('a4.pdf');
  // }

  convertToPdf() {
    const data = document.getElementById('print-container');
    const pdf = new jsPDF('p', 'mm', 'a4'); // A4 size page of PDF
      pdf.html(data);
      pdf.save('report.pdf'); // Generated PDF
    // html2canvas(data).then((canvas) => {
    //   // Few necessary setting options
    //   // const imgWidth = 208;
    //   // const pageHeight = 295;
    //   // const imgHeight = canvas.height * imgWidth / canvas.width;
    //   // const heightLeft = imgHeight;

    //   // const contentDataURL = canvas.toDataURL('image/png')
    //   const pdf = new jsPDF('p', 'mm', 'a4'); // A4 size page of PDF
    //   // const position = 0;
    //   // pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)
    //   // pdf.html(canvas);
    //   pdf.text('canvas', 100, 10, {align:'center'});
    //   pdf.save('report.pdf'); // Generated PDF
    //       });

}


}
