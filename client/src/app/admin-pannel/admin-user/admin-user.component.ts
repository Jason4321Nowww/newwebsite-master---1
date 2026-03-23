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
  keyUpdateError: boolean = false;
  keyPreview: string = '';

  // ── Edit mode ──────────────────────────────────────────────
  editingUserId: string | null = null;
  editRoleLevel: number = 7;
  editUserLocation: string = '';

  roleOptions = [
    { label: 'Admin',               value: 0 },
    { label: 'Vorsitzende',         value: 1 },
    { label: 'Vorstand',            value: 2 },
    { label: 'Regionalverwaltung',  value: 3 },
    { label: 'Lokalverwaltung',     value: 4 },
    { label: 'Vollmitglied',        value: 5 },
    { label: 'Regulaermitglied',    value: 6 },
    { label: 'Oeffentlich',         value: 7 },
  ];

  locationOptions = [
    { value: '', label: '— No location —' },
    { value: 'AG', label: 'Aargau' },
    { value: 'AI', label: 'Appenzell Innerrhoden' },
    { value: 'AR', label: 'Appenzell Ausserrhoden' },
    { value: 'BE', label: 'Bern' },
    { value: 'BL', label: 'Basel-Landschaft' },
    { value: 'BS', label: 'Basel-Stadt' },
    { value: 'FR', label: 'Fribourg' },
    { value: 'GE', label: 'Genf' },
    { value: 'GL', label: 'Glarus' },
    { value: 'GR', label: 'Graubünden' },
    { value: 'JU', label: 'Jura' },
    { value: 'LU', label: 'Luzern' },
    { value: 'NE', label: 'Neuenburg' },
    { value: 'NW', label: 'Nidwalden' },
    { value: 'OW', label: 'Obwalden' },
    { value: 'SG', label: 'St. Gallen' },
    { value: 'SH', label: 'Schaffhausen' },
    { value: 'SO', label: 'Solothurn' },
    { value: 'SZ', label: 'Schwyz' },
    { value: 'TG', label: 'Thurgau' },
    { value: 'TI', label: 'Tessin' },
    { value: 'UR', label: 'Uri' },
    { value: 'VD', label: 'Waadt' },
    { value: 'VS', label: 'Wallis' },
    { value: 'ZG', label: 'Zug' },
    { value: 'ZH', label: 'Zürich' },
  ];

  constructor(private adminuser: AdminuserService) {}

  ngOnInit(): void {
    this.fetchUsers();
    this.fetchKeyPreview();
  }

  fetchUsers(): void {
    this.loading = true;
    this.adminuser.getAllUsers().subscribe({
      next: (res) => { this.users = res; this.loading = false; },
      error: (err) => { console.error(err); this.loading = false; }
    });
  }

  // ── Registration Key ───────────────────────────────────────
  submitKey(): void {
    const key = this.registrationKey.trim();
    if (!key || key.length < 4) {
      this.keyUpdateError = true;
      this.keyUpdateMessage = 'Key must be at least 4 characters.';
      return;
    }

    this.adminuser.createOrUpdateRegistrationKey(key).subscribe({
      next: () => {
        this.keyUpdateError = false;
        this.keyUpdateMessage = 'Registration key updated successfully.';
        this.registrationKey = '';
        this.fetchKeyPreview();
      },
      error: (err) => {
        console.error(err);
        this.keyUpdateError = true;
        this.keyUpdateMessage = err?.error?.message || 'Failed to update key.';
      }
    });
  }

  fetchKeyPreview(): void {
    this.adminuser.getKeyInfo().subscribe({
      next: (res) => { this.keyPreview = res.key || ''; },
      error: () => { this.keyPreview = ''; }
    });
  }

  // ── Activate / Deactivate ──────────────────────────────────
  toggleActivation(user: any): void {
    this.adminuser.updateUser(user.id, { isActive: !user.isActive }).subscribe({
      next: () => this.fetchUsers(),
      error: (err) => console.error(err)
    });
  }

  // ── Inline Edit ────────────────────────────────────────────
  startEdit(user: any): void {
    this.editingUserId = user.id;
    this.editRoleLevel = user.roleLevel;
    this.editUserLocation = user.userLocation || '';
  }

  cancelEdit(): void {
    this.editingUserId = null;
  }

  saveEdit(user: any): void {
    this.adminuser.updateUser(user.id, {
      roleLevel: Number(this.editRoleLevel),
      userLocation: this.editUserLocation
    }).subscribe({
      next: () => {
        this.editingUserId = null;
        this.fetchUsers();
      },
      error: (err) => console.error(err)
    });
  }

  getRoleLabel(value: number): string {
    return this.roleOptions.find(r => r.value === value)?.label ?? String(value);
  }

  getLocationLabel(value: string): string {
    return this.locationOptions.find(l => l.value === value)?.label ?? (value || '—');
  }

  // ── Delete ─────────────────────────────────────────────────
  deleteUser(user: any): void {
    if (!confirm(`Delete user "${user.username}"? This cannot be undone.`)) return;
    this.adminuser.deleteUser(user.id).subscribe({
      next: () => this.fetchUsers(),
      error: (err) => console.error(err)
    });
  }
}
