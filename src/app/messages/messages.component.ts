import { Component, OnInit } from '@angular/core';
import { ContactService } from '../services/contact.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  dataSource: any;
  data: any;
  otp: any;
  sendMessageTo: any;
  contactInfo: boolean = false;
  constructor(
    private contactService: ContactService,
  ) {}

  ngOnInit(): void {
    this.contactService.getListOfMessagesSent().subscribe((data) => {
      this.dataSource = JSON.parse(data);
      let dataArr = new Array(this.dataSource.messageList);
      if (Array.isArray(dataArr[0])) {
        this.data = dataArr[0];
        console.log(this.data);
      }
    });
  }
}
