import { Component, OnInit } from '@angular/core';
import { AdminemailService } from '../admin-services/adminemail.service';

@Component({
  selector: 'app-admin-email',
  templateUrl: './admin-email.component.html',
  styleUrls: ['./admin-email.component.scss']
})
export class AdminEmailComponent implements OnInit {
  name = '';
  email = '';
  listName = '';

  emails: any[] = [];
  lists: string[] = [];

  selectedId: string | null = null;


  constructor(private emailService: AdminemailService) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.emailService.getAllEmails().subscribe((data: any) => this.emails = data);
    this.emailService.getLists().subscribe((lists: any) => this.lists = lists);
  }

  createEmail() {
    this.emailService.createEmail({ name: this.name, email: this.email })
      .subscribe(() => this.load());
  }

  deleteEmail(id: string) {
    this.emailService.deleteEmail(id).subscribe(() => this.load());
  }

  addToList(emailId: string) {
    this.emailService.addToList(emailId, this.listName)
      .subscribe(() => this.load());
  }

  removeFromList(emailId: string) {
    this.emailService.removeFromList(emailId, this.listName)
      .subscribe(() => this.load());
  }
}

