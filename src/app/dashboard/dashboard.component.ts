import {
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { ContactService } from '../services/contact.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject, catchError, filter, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  private readonly destroyed$ = new Subject<boolean>();
  dataSource: any;
  data: any;
  otp: any;
  contactsArr: string[] = [];
  checkContacts: any;
  sendMessageTo: any;
  contactInfo: boolean = false;
  addNumber: any;
  public formData: FormGroup;

  getNewContactId: any;
  @ViewChildren('checkboxes') checkboxes: QueryList<ElementRef> | any;
  constructor(
    private contactService: ContactService,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal,
    private fb: FormBuilder,
  ) {
    this.formData = this.fb.group({
      Firstname: new FormControl('', [
        Validators.required,
        Validators.maxLength(10),
      ]),
      Lastname: new FormControl('', [
        Validators.required,
        Validators.maxLength(15),
      ]),
      email: new FormControl('', [
        Validators.required,
        Validators.maxLength(100),
        Validators.email,
      ]),
      phoneNumber: new FormControl('', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(10),
        Validators.pattern('[0-9]{10}'),
      ]),
      createdAt: new FormControl(new Date()),
    });
  }

  ngOnInit(): void {
    this.contactService.showAllContacts().subscribe((data) => {
      this.getNewContactId = JSON.parse(data).contacts.length + 1
      this.dataSource = JSON.parse(data);
      let dataArr = new Array(this.dataSource.contacts);
      if (Array.isArray(dataArr[0])) {
        this.data = dataArr[0];
      }
    });
  }

  viewContactDetails(user: any) {
    if (user?.name) {
      this.contactInfo = true;
    }
    this.router
      .navigate(['../info/' + user.id], { relativeTo: this.route })
      .catch((e) => {});
  }

  sendMessage(contact: Event) {
    const x = Math.random() * 10000000;
    this.otp = Math.trunc(x);
    this.sendMessageTo = (contact.target as HTMLInputElement).value;
    this.contactService.sendMessage(this.sendMessageTo, this.otp).pipe(
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
  }

  sendOtpToMultipleContacts() {
    if (this.contactsArr.length > 0) {
      this.contactsArr.forEach((contact) => {
        setTimeout(() => {
          this.contactService.sendMessage(contact, this.otp).pipe(
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
        }, 1000);
      });
      this.clearCheckBoxes();
    }
  }

  openOTPModal(content: any) {
    const x = Math.random() * 1000000;
    this.otp = Math.trunc(x);
    this.modalService.open(content, { centered: true });
  }

  clearCheckBoxes() {
    this.contactsArr = [];
    this.checkboxes.forEach(
      (element: { nativeElement: { checked: boolean } }) => {
        element.nativeElement.checked = false;
      }
    );
  }

  addContact() {
    this.contactService.addContacts(+this.getNewContactId, this.formData.value).subscribe((response) => {
      return
    })
  }

  removeContact(content: any,event: any) {
    this.modalService.open(content, { centered: true });
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
