import { Component, OnInit } from '@angular/core';
import { AdmincontactService } from '../admin-services/admincontact.service';
import { Contact } from '../../_models/contact';

@Component({
  selector: 'app-admin-contacts',
  templateUrl: './admin-contacts.component.html',
  styleUrl: './admin-contacts.component.scss'
})
export class AdminContactsComponent implements OnInit {
  contacts: Contact[] = [];

  // Add form
  showAddForm = false;
  newName = '';
  newEmail = '';
  newParticipation = '';

  // Inline edit
  editingId: string | null = null;
  editName = '';
  editEmail = '';
  editParticipation = '';

  participationOptions = ['member', 'donor', 'simp'];

  constructor(private admincontact: AdmincontactService) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.admincontact.getAllContacts().subscribe({
      next: res => { this.contacts = res.data; },
      error: err => console.error('Error loading contacts:', err)
    });
  }

  createContact() {
    const name = this.newName.trim();
    const email = this.newEmail.trim();
    if (!name || !email || !this.newParticipation) return;
    this.admincontact.createContact({ name, email, participation: this.newParticipation }).subscribe({
      next: () => {
        this.newName = '';
        this.newEmail = '';
        this.newParticipation = '';
        this.showAddForm = false;
        this.load();
      },
      error: err => alert(err.error?.message || 'Failed to create contact')
    });
  }

  startEdit(c: Contact) {
    this.editingId = c._id!;
    this.editName = c.name;
    this.editEmail = c.email;
    this.editParticipation = c.participation;
  }

  saveEdit() {
    if (!this.editingId) return;
    this.admincontact.updateContact(this.editingId, {
      name: this.editName.trim(),
      email: this.editEmail.trim(),
      participation: this.editParticipation
    }).subscribe({
      next: () => { this.editingId = null; this.load(); },
      error: err => alert(err.error?.message || 'Failed to update contact')
    });
  }

  cancelEdit() {
    this.editingId = null;
  }

  deleteContact(id: string) {
    if (!confirm('Delete this contact?')) return;
    this.admincontact.deleteContact(id).subscribe({
      next: () => this.load(),
      error: err => alert(err.error?.message || 'Failed to delete contact')
    });
  }
}
