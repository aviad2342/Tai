import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ExportAsConfig, ExportAsService, SupportedExtensions } from 'ngx-export-as';
import { Order } from '../../order/order.model';
import * as jspdf from 'jspdf';
import domtoimage from 'dom-to-image';
import { Coupon } from 'src/app/store/coupon.model';
import { CouponService } from 'src/app/store/coupon.service';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss'],
})
export class InvoiceComponent implements OnInit {

  @ViewChild('container') container;
  @Input() order: Order ;
  @Input() coupon: Coupon;
  @Input() useCoupon = false;
  taxRate = 17 / 100;
  totalDiscount = 0;
  exportAsConfig: ExportAsConfig = {
    type: 'png', // the type you want to download
    elementIdOrContent: 'invoice',
  }

  config: ExportAsConfig = {
    type: 'pdf',
    elementIdOrContent: 'invoice',
    options: {
      jsPDF: {
        orientation: 'landscape'
      },
      pdfCallbackFn: this.pdfCallbackFn // to add header and footer
    }
  };

  constructor(private exportAsService: ExportAsService, private couponService: CouponService,) { }

  ngOnInit() {}

  getTotalDiscount() {
    return this.order?.items.find(i => i.productId === this.coupon?.itemId).price * (this.coupon?.discount / 100);
  }

  public convertToPDF() {
    const div = document.getElementById('invoice');
    const options = { background: 'white', height: 740, width: 1050 };
    domtoimage.toPng(div, options).then(
      (dataUrl) =>
    {
      const doc = new jspdf.jsPDF('p', 'px', 'a4');
      doc.setR2L(true);
      doc.addImage(dataUrl, 'PNG', 0, 0, 450, 330,);
      doc.save('invoice.pdf');
    });
}

public convertPDF() {
  // const div = document.getElementById('invoice');
  // const options = { background: 'white', height: 740, width: 1050 };
  domtoimage.toPng(this.container.nativeElement).then(
    (dataUrl) =>
  {
    const doc = new jspdf.jsPDF('p', 'px', 'a4');
    doc.setR2L(true);
    doc.addImage(dataUrl, 'PNG', 0, 0, 450, 250);
    doc.save('invoice.pdf');
  });
}

  export() {
    // download the file using old school javascript method
    // this.exportAsService.save(this.exportAsConfig, 'invoice').subscribe(() => {
    // });
    // get the data as base64 or json object for json type - this will be helpful in ionic or SSR
    this.exportAsService.get(this.exportAsConfig).subscribe(content => {
      console.log(content);
      const doc = new jspdf.jsPDF('p', 'mm', 'a4');
        doc.addImage(content, 'PNG', 0, 0, 120, 150);
        doc.save('invoice.pdf');
    });
  }

  exportAs(type: SupportedExtensions, opt?: string) {
    this.config.type = type;
    if (opt) {
      this.config.options.jsPDF.orientation = opt;
    }
    this.exportAsService.save(this.config, 'myFile').subscribe(() => {
      // save started
    });
    // this.exportAsService.get(this.config).subscribe(content => {
    //   const link = document.createElement('a');
    //   const fileName = 'export.pdf';

    //   link.href = content;
    //   link.download = fileName;
    //   link.click();
    //   console.log(content);
    // });
  }

  exportAsString(type: SupportedExtensions, opt?: string) {
    this.config.elementIdOrContent = '<div> test string </div>';
    this.exportAs(type, opt);
    setTimeout(() => {
      this.config.elementIdOrContent = 'mytable';
    }, 1000);
  }

  pdfCallbackFn (pdf: any) {
    // example to add page number as footer to every page of pdf
    const noOfPages = pdf.internal.getNumberOfPages();
    for (let i = 1; i <= noOfPages; i++) {
      pdf.setPage(i);
      pdf.text('Page ' + i + ' of ' + noOfPages, pdf.internal.pageSize.getWidth() - 100, pdf.internal.pageSize.getHeight() - 30);
    }
  }

}
