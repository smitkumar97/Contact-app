import { Component, ElementRef, EventEmitter, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ContactService } from '../services/contact.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  dataSource: any;
  data: any;
  otp: any;
  contactsArr : string[] = [];
  checkContacts: any;
  sendMessageTo: any;
  contactInfo: boolean = false;
  @ViewChildren("checkboxes") checkboxes: QueryList<ElementRef> | any;
  constructor(
    private contactService: ContactService,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.contactService.showAllContacts().subscribe((data) => {
      this.dataSource = JSON.parse(data);
      let dataArr = new Array(this.dataSource.contacts);
      if (Array.isArray(dataArr[0])) {
        this.data = dataArr[0];
      }
    });
  }

  viewContactDetails(user:any) {
    if (user && user.name) {
      this.contactInfo = true
    }
    this.router
      .navigate(['../info/'+ user.id], { relativeTo: this.route })
      .catch((e) => {});
  }

  sendMessage(contact: Event) {
    const x = Math.random() * 10000000;
    this.otp = Math.trunc(x);
    this.sendMessageTo = (contact.target as HTMLInputElement).value;
    this.contactService.sendMessage(this.sendMessageTo, this.otp).subscribe(
      (data) => {
        console.log("Response of SMS from server - ",data);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  selectedContacts(contact: any) {
    this.sendMessageTo = (contact.target as HTMLInputElement).value;
    if (contact.target.checked) {
      if (this.contactsArr.includes(this.sendMessageTo)) {
        return;
      } else {
        this.contactsArr.push(this.sendMessageTo);
        this.checkContacts = contact;
      }
    } else {
      const index = this.contactsArr.indexOf(this.sendMessageTo);
      if (index > -1) {
        this.contactsArr.splice(index, 1);
      }
    }
    console.log(this.contactsArr);
  }

  sendOtpToMultipleContacts() {
    if (this.contactsArr.length > 0) {
      this.contactsArr.forEach((contact) => {
        setTimeout(() => {
          this.contactService.sendMessage(contact,this.otp).subscribe(
            (data) => {
              console.log("Response of SMS from server - ",data);
            },
            (err) => {
              console.log(err);
            }
          );
        }, 1000);
      })
      this.clearCheckBoxes();
      // document.getElementById("check1").checked = true;
    }
  }

  listOfMessagesSent(contact:any) {
    console.log("Hello world!",contact);
  }

  openOTPModal(content: any) {
    const x = Math.random() * 1000000;
    this.otp = Math.trunc(x);
		this.modalService.open(content, { centered: true });
	}

  closeOTPModal() {
    this.contactsArr = []
  }

  clearCheckBoxes() {
    this.contactsArr = [];
    this.checkboxes.forEach((element: { nativeElement: { checked: boolean; }; }) => {
        element.nativeElement.checked = false;
    });
    console.log(this.contactsArr);

  }
}
