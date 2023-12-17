import { Component, OnInit } from '@angular/core';
import { ContactService } from './../services/contact.service';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject, catchError, filter, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'app-contact-info',
  templateUrl: './contact-info.component.html',
  styleUrls: ['./contact-info.component.css'],
})
export class ContactInfoComponent implements OnInit {
  private readonly destroyed$ = new Subject<boolean>();
  data: any;
  id: any;
  otp: any;
  showContact: boolean = false;

  constructor(
    private contactService: ContactService,
    private route: ActivatedRoute,
    private modalService: NgbModal
  ) { }

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
    this.contactService.sendMessage(sendMessageTo, this.otp).pipe(
      takeUntil(this.destroyed$),
      filter(data => !!data),
      tap(response => {
        alert(response.msg);
      }),
      catchError(error => {
        alert(error.message);
        throw error;
      })
    ).subscribe();
  }

  openVerticallyCentered(content: any) {
    const x = Math.random() * 1000000;
    this.otp = Math.trunc(x);
    this.modalService.open(content, { centered: true });
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
