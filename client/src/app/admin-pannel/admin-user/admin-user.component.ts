import { Component, OnInit } from '@angular/core';
import { AdminuserService } from '../admin-services/adminuser.service';

@Component({
  selector: 'app-admin-user',
  templateUrl: './admin-user.component.html',
  styleUrl: './admin-user.component.scss'
})
export class AdminUserComponent implements OnInit {
  users: any[] = [];
  loading = false;
  registrationKey: string = '';
  keyUpdateMessage: string = '';
  keyPreview: string = ''; // ✅ To show current key



roleOptions = [
  { label: 'Admin', value: 0 },            // sees all events
  { label: 'Vorsitzende', value: 1 },             // party leader: sees Vorsitzende + Vorstand events
  { label: 'Vorstand', value: 2 },                // national leadership: sees only Vorstand events
  { label: 'Regionalverwaltung', value: 3 },      // regional leadership events
  { label: 'Lokalverwaltung', value: 4 },         // communal leadership
  { label: 'Vollmitglied', value: 5 },            // trustworthy members
  { label: 'Regulaermitglied', value: 6 },        // internal: seen by everyone with account
  { label: 'Oeffentlich', value: 7 }              // public
];


  locationOptions = [
  { value: 'ZH', label: 'Zürich' },
  { value: 'SH', label: 'Schaffhausen' },
  { value: 'BE', label: 'Bern' },
  { value: 'LU', label: 'Lucerne' },
  // add all other branch codes here
];


  constructor(private adminuser: AdminuserService) {}

  ngOnInit(): void {
    this.fetchUsers();
    this.fetchKeyPreview(); // ✅ Load key preview on page load
  }

  fetchUsers(): void {
    this.loading = true;
    this.adminuser.getAllUsers().subscribe({
      next: (res) => {
        this.users = res;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  toggleActivation(user: any): void {
    const newStatus = !user.isActive;
    this.adminuser.updateUser(user.id, { isActive: newStatus }).subscribe({
      next: () => this.fetchUsers(),
      error: (err) => console.error(err)
    });
  }

onRoleChange(newRole: number, user: any): void {
  this.adminuser.updateUser(user.id, { roleLevel: Number(newRole) }).subscribe({
    next: () => this.fetchUsers(),
    error: (err) => console.error(err)
  });
}

onLocationChange(newLocation: string, user: any): void {
  this.adminuser.updateUser(user.id, {  userLocation: newLocation }).subscribe({
    next: () => this.fetchUsers(),
    error: (err) => console.error(err)
  });
}


// delete user
deleteUser(user: any): void {
  if (!confirm(`Are you sure you want to delete ${user.username}?`)) return;

  this.adminuser.deleteUser(user.id).subscribe({
    next: () => {
      alert('User deleted successfully.');
      this.fetchUsers();
    },
    error: (err) => console.error(err)
  });
}

 

  submitKey(): void {
    if (!this.registrationKey || this.registrationKey.length !== 4) {
      this.keyUpdateMessage = 'Key must be exactly 4 characters.';
      return;
    }

    this.adminuser.createOrUpdateRegistrationKey(this.registrationKey).subscribe({
      next: () => {
        this.keyUpdateMessage = 'Registration key updated successfully.';
        this.registrationKey = '';
        this.fetchKeyPreview(); // ✅ Refresh key preview
      },
      error: (err) => {
        console.error(err);
        this.keyUpdateMessage = 'Failed to update key.';
      }
    });
  }

  fetchKeyPreview(): void {
    this.adminuser.getKeyInfo().subscribe({
      next: (res) => {
        this.keyPreview = res.key || 'Hidden';
      },
      error: (err) => {
        console.error(err);
        this.keyPreview = 'N/A';
      }
    });
  }
}
