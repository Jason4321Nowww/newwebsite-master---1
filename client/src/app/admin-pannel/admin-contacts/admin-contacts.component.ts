import { Component } from '@angular/core';
import { AdmincontactService } from '../admin-services/admincontact.service';
import { Contact } from '../../_models/contact';

@Component({
  selector: 'app-admin-contacts',
   templateUrl: './admin-contacts.component.html',
  styleUrl: './admin-contacts.component.scss'
})
export class AdminContactsComponent {

 contacts: Contact[] = [];

  constructor(private admincontact: AdmincontactService) {}

  ngOnInit(): void {
    this.admincontact.getAllContacts().subscribe({
      next: (res) => {
        this.contacts = res.data;
        console.log(this.contacts)
      },
      error: (err) => {
        console.error('Error loading contacts:', err);
      }
    });
  }

}
