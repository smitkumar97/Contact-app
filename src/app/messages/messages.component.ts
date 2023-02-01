import { Component, OnInit } from '@angular/core';
import { ContactService } from '../services/contact.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css'],
})
export class MessagesComponent implements OnInit {
  dataSource: any;
  contactDataSource: any;
  data: any = [];
  contactData: any;
  otp: any;
  sendMessageTo: any;
  contactInfo: boolean = false;
  mergedArr: any = [];
  newContact: any;
  constructor(private contactService: ContactService) {}

  ngOnInit(): void {
    this.contactService.getListOfMessagesSent().subscribe((data) => {
      this.dataSource = JSON.parse(data);
      let dataArr = new Array(this.dataSource.messageList);
      if (Array.isArray(dataArr[0])) {
        this.data = dataArr[0];
        this.fetchContactNames();
      }
    });
  }

  fetchContactNames() {
    this.contactService.showAllContacts().subscribe((data) => {
      this.contactDataSource = JSON.parse(data);
      let dataArr = new Array(this.contactDataSource.contacts);
      if (Array.isArray(dataArr[0])) {
        this.contactData = dataArr[0];
      }

      for (let i = 0; i < this.data.length; i++) {
        this.mergedArr.push({
          ...this.data[i],
          ...this.contactData.find(
            (itmInner: any) => itmInner.to === this.data[i].phone
          ),
        });
      }
      this.data = this.mergedArr;
    });
  }
}
