import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ContactService } from './../services/contact.service';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-contact-info',
  templateUrl: './contact-info.component.html',
  styleUrls: ['./contact-info.component.css'],
})
export class ContactInfoComponent implements OnInit {
  data: any;
  id: any;
  otp: any;
  showContact: boolean = false;

  constructor(
    private contactService: ContactService,
    private route: ActivatedRoute,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.id = params['id'] - 1;
        this.contactDetails();
      }
    });
  }

  contactDetails() {
    this.contactService.getContactDetails(this.id).subscribe((data) => {
      this.data = JSON.parse(data);
      if (Object.keys(this.data).length > 0) {
        this.showContact = true;
      } else {
        this.showContact = false;
      }
    });
  }

  sendMessage(sendMessageTo: any) {
    this.contactService.sendMessage(sendMessageTo, this.otp).subscribe(
      (data) => {
        console.log('Response of SMS from server - ', data);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  openVerticallyCentered(content: any) {
    const x = Math.random() * 1000000;
    this.otp = Math.trunc(x);
    this.modalService.open(content, { centered: true });
  }
}
