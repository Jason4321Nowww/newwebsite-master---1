import {Component, OnInit} from '@angular/core';
import {AdminemailService} from '../admin-services/adminemail.service';

@Component({
  selector: 'app-admin-email',
  templateUrl: './admin-email.component.html',
  styleUrls: ['./admin-email.component.scss']
})
export class AdminEmailComponent implements OnInit {
  // Lists
  lists: string[] = [];
  selectedList = '';

  // New list inline form
  showNewListInput = false;
  newListName = '';

  // Rename list inline form
  editingListName = '';
  editListValue = '';

  // Emails in selected list
  listEmails: any[] = [];

  // Add email inline form
  showEmailForm = false;
  emailName = '';
  emailAddress = '';

  // Inline edit for email rows
  editingEmailId: string | null = null;
  editEmailName = '';
  editEmailAddress = '';
  assigningEmailId: string | null = null;
  assignListTarget = '';

  constructor(private emailService: AdminemailService) {
  }

  ngOnInit() {
    this.loadLists();
    this.loadListEmails();
  }

  get assignableLists(): string[] {
    // Lists this email isn't already a member of
    const email = this.listEmails.find(e => e._id === this.assigningEmailId);
    if (!email) return this.lists;
    return this.lists.filter(l => !email.lists?.includes(l));
  }

  startAssign(e: any) {
    this.assigningEmailId = e._id;
    this.assignListTarget = '';
  }

  cancelAssign() {
    this.assigningEmailId = null;
    this.assignListTarget = '';
  }

  confirmAssign() {
    if (!this.assigningEmailId || !this.assignListTarget) return;
    this.emailService.addToList(this.assigningEmailId, this.assignListTarget).subscribe(() => {
      this.assigningEmailId = null;
      this.assignListTarget = '';
      this.loadListEmails();
    });
  }

  removeFromCurrentList(e: any) {
    if (!this.selectedList) return;
    if (!confirm(`Remove "${e.name}" from "${this.selectedList}"?`)) return;
    this.emailService.removeFromList(e._id, this.selectedList).subscribe(() => this.loadListEmails());
  }

  loadLists() {
    this.emailService.getLists().subscribe((lists: string[]) => {
      this.lists = lists;
      if (this.selectedList && !lists.includes(this.selectedList)) {
        this.selectedList = '';
        this.loadListEmails();
      }
    });
  }

  onListChange() {
    this.showEmailForm = false;
    this.editingEmailId = null;
    this.editingListName = '';
    this.loadListEmails();
  }

  loadListEmails() {
    if (!this.selectedList) {
      this.emailService.getAllEmails().subscribe(data => {
        this.listEmails = data;
      });
    } else {
      this.emailService.getEmailsByList(this.selectedList).subscribe(data => {
        this.listEmails = data;
      });
    }
  }

  // ─── List CRUD ─────────────────────────────────────────────────────────────

  createList() {
    const name = this.newListName.trim();
    if (!name) return;
    this.emailService.createList(name).subscribe({
      next: () => {
        this.newListName = '';
        this.showNewListInput = false;
        this.selectedList = name;
        this.loadLists();
        this.loadListEmails();
      },
      error: err => alert(err.error?.error || 'Failed to create list')
    });
  }

  startEditList() {
    this.editingListName = this.selectedList;
    this.editListValue = this.selectedList;
  }

  saveEditList() {
    const newName = this.editListValue.trim();
    if (!newName || newName === this.editingListName) {
      this.editingListName = '';
      return;
    }
    this.emailService.renameList(this.editingListName, newName).subscribe({
      next: () => {
        this.selectedList = newName;
        this.editingListName = '';
        this.loadLists();
        this.loadListEmails();
      },
      error: err => alert(err.error?.error || 'Failed to rename list')
    });
  }

  cancelEditList() {
    this.editingListName = '';
  }

  deleteList() {
    if (!this.selectedList) return;
    if (!confirm(`Delete
    list "${this.selectedList}" and remove it from all emails?`)) return;
    this.emailService.deleteList(this.selectedList).subscribe(() => {
      this.selectedList = '';
      this.listEmails = [];
      this.loadLists();
    });
  }

  // ─── Email CRUD ─────────────────────────────────────────────────────────────

  createEmail() {
    const name = this.emailName.trim();
    const email = this.emailAddress.trim();
    if (!name || !email) return;
    this.emailService.createEmail({name, email}).subscribe((created: any) => {
      const finish = () => {
        this.emailName = '';
        this.emailAddress = '';
        this.showEmailForm = false;
        this.loadListEmails();
      };
      if (this.selectedList) {
        this.emailService.addToList(created._id, this.selectedList).subscribe(finish);
      } else {
        finish();
      }
    });
  }

  startEditEmail(e: any) {
    this.editingEmailId = e._id;
    this.editEmailName = e.name;
    this.editEmailAddress = e.email;
  }

  saveEditEmail() {
    if (!this.editingEmailId) return;
    this.emailService.updateEmail(this.editingEmailId, {
      name: this.editEmailName.trim(),
      email: this.editEmailAddress.trim()
    }).subscribe(() => {
      this.editingEmailId = null;
      this.loadListEmails();
    });
  }

  cancelEditEmail() {
    this.editingEmailId = null;
  }

  deleteEmail(id: string) {
    if (!confirm('Delete this email entry?')) return;
    this.emailService.deleteEmail(id).subscribe(() => this.loadListEmails());
  }
}
