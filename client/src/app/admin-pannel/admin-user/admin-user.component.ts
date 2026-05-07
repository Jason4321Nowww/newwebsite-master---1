import { Component, OnInit } from '@angular/core';
import { AdminuserService } from '../admin-services/adminuser.service';
import { LocationService, Canton } from 'src/app/services/location.service';

@Component({
  selector: 'app-admin-user',
  templateUrl: './admin-user.component.html',
  styleUrl: './admin-user.component.scss'
})
export class AdminUserComponent implements OnInit {
  users: any[] = [];
  loading = false;
  adminRoleLevel = 0;
  adminId        = '';
  isSuperAdmin   = false;

  // ── Registration Key ───────────────────────────────────────
  registrationKey: string = '';
  keyUpdateMessage: string = '';
  keyUpdateError: boolean = false;
  keyPreview: string = '';
  copied: boolean = false;

  // ── Unified Invite section ─────────────────────────────────
  inviteEmail       = '';
  inviteRoleLevel:  number | null = null;
  inviting          = false;
  inviteMessage     = '';
  inviteError       = false;
  sentInvites:      any[] = [];   // admin-track invites
  sentUserInvites:  any[] = [];   // user-track invites
  pendingAdmins:    any[] = [];
  inviteOptions:    { label: string; value: number }[] = [];

  // Cascading location for invite (only shown for roles >= 4)
  cantons:        Canton[] = [];
  inviteBezirke:  string[] = [];
  inviteGemeinden: string[] = [];
  inviteKantonCode = '';
  inviteKantonName = '';
  inviteBezirk     = '';
  inviteGemeinde   = '';

  // ── Cascading location for inline edit ─────────────────────
  editBezirke:   string[] = [];
  editGemeinden: string[] = [];
  editKantonCode = '';
  editKantonName = '';
  editBezirk     = '';
  editGemeinde   = '';

  // ── Edit mode ──────────────────────────────────────────────
  editingUserId: string | null = null;
  editRoleLevel: number = 7;

  private readonly allRoleOptions = [
    { label: 'Superadmin',          value: 0 },
    { label: 'Vorsitzende',         value: 1 },
    { label: 'Vorstand',            value: 2 },
    { label: 'Admin',               value: 3 },
    { label: 'Regionalverwaltung',  value: 4 },
    { label: 'Lokalverwaltung',     value: 5 },
    { label: 'Vollmitglied',        value: 6 },
    { label: 'Regulaermitglied',    value: 7 },
    { label: 'Oeffentlich',         value: 8 },
  ];

  roleOptions: { label: string; value: number }[] = [];

  private getAdminRoleLevel(): number {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) return 0;
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.roleLevel ?? 0;
    } catch {
      return 0;
    }
  }

  private getAdminId(): string {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) return '';
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.id ?? '';
    } catch {
      return '';
    }
  }

  isSelf(user: any): boolean {
    const uid = user.id || user._id?.toString();
    return !!this.adminId && uid === this.adminId;
  }

  canManage(user: any): boolean {
    return !this.isSelf(user) && user.roleLevel > this.adminRoleLevel && user._status !== 'pending';
  }

  canEdit(user: any): boolean {
    return this.canManage(user) && user.isActive === true;
  }

  canDelete(user: any): boolean {
    return !this.isSelf(user) && user.roleLevel > this.adminRoleLevel;
  }

  getStatusLabel(user: any): string {
    if (user._status === 'pending')  return 'Pending';
    if (user._status === 'inactive') return 'Inactive';
    return 'Active';
  }

  constructor(private adminuser: AdminuserService, private locationSvc: LocationService) {}

  ngOnInit(): void {
    this.adminRoleLevel = this.getAdminRoleLevel();
    this.adminId        = this.getAdminId();
    this.isSuperAdmin   = this.adminRoleLevel === 0;
    // Can only invite roles strictly below own level
    this.inviteOptions  = this.allRoleOptions.filter(r => r.value > this.adminRoleLevel);
    this.roleOptions    = this.allRoleOptions.filter(r => r.value > this.adminRoleLevel);

    this.locationSvc.getCantons().subscribe({
      next: (data) => { this.cantons = data; },
      error: () => {}
    });

    this.fetchUsers();
    this.fetchKeyPreview();
    this.fetchSentInvites();
    this.fetchUserInvites();
    if (this.adminRoleLevel <= 2) {
      this.fetchPendingAdmins();
    }
  }

  // ── Invite location cascade ────────────────────────────────
  onInviteRoleLevelChange(val: string): void {
    this.inviteRoleLevel = val === '' ? null : Number(val);
  }

  onInviteKantonChange(kantonCode: string): void {
    const canton = this.cantons.find(c => c.kantonCode === kantonCode);
    this.inviteKantonCode = kantonCode;
    this.inviteKantonName = canton?.kantonName || '';
    this.inviteBezirk     = '';
    this.inviteGemeinde   = '';
    this.inviteBezirke    = [];
    this.inviteGemeinden  = [];
    if (kantonCode) {
      this.locationSvc.getBezirke(kantonCode).subscribe({
        next: (data) => { this.inviteBezirke = data; },
        error: () => {}
      });
    }
  }

  onInviteBezirkChange(bezirk: string): void {
    this.inviteBezirk    = bezirk;
    this.inviteGemeinde  = '';
    this.inviteGemeinden = [];
    if (bezirk && this.inviteKantonCode) {
      this.locationSvc.getGemeinden(this.inviteKantonCode, bezirk).subscribe({
        next: (data) => { this.inviteGemeinden = data; },
        error: () => {}
      });
    }
  }

  private resetInviteLocation(): void {
    this.inviteKantonCode = '';
    this.inviteKantonName = '';
    this.inviteBezirk     = '';
    this.inviteGemeinde   = '';
    this.inviteBezirke    = [];
    this.inviteGemeinden  = [];
  }

  // ── Unified Send Invite ────────────────────────────────────
  sendInvite(): void {
    if (!this.inviteEmail || this.inviteRoleLevel === null) return;
    this.inviting      = true;
    this.inviteMessage = '';
    this.inviteError   = false;

    const userLocation = {
      kantonCode: this.inviteKantonCode,
      kantonName: this.inviteKantonName,
      bezirk:     this.inviteBezirk,
      gemeinde:   this.inviteGemeinde,
    };

    // Roles 0-3 → admin invite endpoint; Roles 4-8 → user invite endpoint
    const obs = this.inviteRoleLevel <= 3
      ? this.adminuser.sendInvite(this.inviteEmail, this.inviteRoleLevel, userLocation)
      : this.adminuser.sendUserInvite(this.inviteEmail, this.inviteRoleLevel, userLocation);

    obs.subscribe({
      next: () => {
        this.inviting      = false;
        this.inviteMessage = 'Invitation sent successfully.';
        this.inviteEmail     = '';
        this.inviteRoleLevel = null;
        this.resetInviteLocation();
        this.fetchUsers();
        this.fetchSentInvites();
        this.fetchUserInvites();
      },
      error: (err) => {
        this.inviting      = false;
        this.inviteError   = true;
        this.inviteMessage = err.error?.error || 'Failed to send invitation.';
      }
    });
  }

  fetchSentInvites(): void {
    this.adminuser.getInvites().subscribe({
      next: (res) => { this.sentInvites = res; },
      error: () => {}
    });
  }

  fetchUserInvites(): void {
    this.adminuser.getUserInvites().subscribe({
      next: (res) => { this.sentUserInvites = res; },
      error: () => {}
    });
  }

  fetchPendingAdmins(): void {
    this.adminuser.getPendingAdmins().subscribe({
      next: (res) => { this.pendingAdmins = res; },
      error: () => {}
    });
  }

  activateAdmin(admin: any): void {
    this.adminuser.activateAdmin(admin._id).subscribe({
      next: () => { this.fetchPendingAdmins(); },
      error: (err) => { alert(err.error?.error || 'Failed to activate admin.'); }
    });
  }

  // ── Users ──────────────────────────────────────────────────
  fetchUsers(): void {
    this.loading = true;
    this.adminuser.getAllUsers().subscribe({
      next: (res) => { this.users = res; this.loading = false; },
      error: (err) => { console.error(err); this.loading = false; }
    });
  }

  getRoleName(level: number): string {
    return this.allRoleOptions.find(r => r.value === level)?.label ?? `Role ${level}`;
  }

  // ── Registration Key ───────────────────────────────────────
  generateKey(): void {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const digits = '0123456789';
    const symbols = '!@#$%^&+=_-.,;:|~?';
    const charset = letters + digits + symbols;
    let key: string;
    do {
      const array = new Uint8Array(20);
      window.crypto.getRandomValues(array);
      key = Array.from(array).map(b => charset[b % charset.length]).join('');
    } while (!/[A-Za-z]/.test(key) || !/[0-9]/.test(key) || !/[!@#$%^&+=_\-.,;:|~?]/.test(key));
    this.registrationKey = key;
  }

  submitKey(): void {
    const key = this.registrationKey.trim();
    if (!key || key.length !== 20) {
      this.keyUpdateError = true;
      this.keyUpdateMessage = 'Key must be exactly 20 characters.';
      return;
    }
    if (!/^[A-Za-z0-9!@#$%^&+=\-_.,;:|~?]+$/.test(key)) {
      this.keyUpdateError = true; this.keyUpdateMessage = 'Key contains invalid characters.'; return;
    }
    if (!/[A-Za-z]/.test(key)) {
      this.keyUpdateError = true; this.keyUpdateMessage = 'Key must contain at least one letter.'; return;
    }
    if (!/[0-9]/.test(key)) {
      this.keyUpdateError = true; this.keyUpdateMessage = 'Key must contain at least one number.'; return;
    }
    if (!/[!@#$%^&+=\-_.,;:|~?]/.test(key)) {
      this.keyUpdateError = true;
      this.keyUpdateMessage = 'Key must contain at least one special character (! @ # $ % ^ & + = - _ . , ; : | ~ ?).';
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
        this.keyUpdateError = true;
        this.keyUpdateMessage = err?.error?.message || 'Failed to update key.';
      }
    });
  }

  copyKey(): void {
    navigator.clipboard.writeText(this.keyPreview).then(() => {
      this.copied = true;
      setTimeout(() => this.copied = false, 2000);
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

  // ── Inline Edit location cascade ───────────────────────────
  onEditKantonChange(kantonCode: string): void {
    const canton = this.cantons.find(c => c.kantonCode === kantonCode);
    this.editKantonCode = kantonCode;
    this.editKantonName = canton?.kantonName || '';
    this.editBezirk     = '';
    this.editGemeinde   = '';
    this.editBezirke    = [];
    this.editGemeinden  = [];
    if (kantonCode) {
      this.locationSvc.getBezirke(kantonCode).subscribe({
        next: (data) => { this.editBezirke = data; },
        error: () => {}
      });
    }
  }

  onEditBezirkChange(bezirk: string): void {
    this.editBezirk    = bezirk;
    this.editGemeinde  = '';
    this.editGemeinden = [];
    if (bezirk && this.editKantonCode) {
      this.locationSvc.getGemeinden(this.editKantonCode, bezirk).subscribe({
        next: (data) => { this.editGemeinden = data; },
        error: () => {}
      });
    }
  }

  // ── Inline Edit ────────────────────────────────────────────
  startEdit(user: any): void {
    this.editingUserId  = user.id;
    this.editRoleLevel  = user.roleLevel;
    const loc = user.userLocation || {};
    this.editKantonCode = loc.kantonCode || '';
    this.editKantonName = loc.kantonName || '';
    this.editBezirk     = loc.bezirk     || '';
    this.editGemeinde   = loc.gemeinde   || '';
    this.editBezirke    = [];
    this.editGemeinden  = [];
    if (this.editKantonCode) {
      this.locationSvc.getBezirke(this.editKantonCode).subscribe({
        next: (data) => {
          this.editBezirke = data;
          if (this.editBezirk) {
            this.locationSvc.getGemeinden(this.editKantonCode, this.editBezirk).subscribe({
              next: (g) => { this.editGemeinden = g; },
              error: () => {}
            });
          }
        },
        error: () => {}
      });
    }
  }

  cancelEdit(): void { this.editingUserId = null; }

  saveEdit(user: any): void {
    this.adminuser.updateUser(user.id, {
      roleLevel: Number(this.editRoleLevel),
      userLocation: {
        kantonCode: this.editKantonCode,
        kantonName: this.editKantonName,
        bezirk:     this.editBezirk,
        gemeinde:   this.editGemeinde,
      }
    }).subscribe({
      next: () => { this.editingUserId = null; this.fetchUsers(); },
      error: (err) => console.error(err)
    });
  }

  getRoleLabel(value: number): string {
    return this.allRoleOptions.find(r => r.value === value)?.label ?? String(value);
  }

  getLocationLabel(loc: any): string {
    if (!loc) return '—';
    if (typeof loc === 'string') return loc || '—';
    const parts = [loc.kantonName, loc.bezirk, loc.gemeinde].filter(Boolean);
    return parts.length ? parts.join(', ') : '—';
  }

  // ── Delete ─────────────────────────────────────────────────
  deleteUser(user: any): void {
    const label = user._status === 'pending'
      ? `Cancel invite for "${user.email}"?`
      : `Delete user "${user.username}"? This cannot be undone.`;
    if (!confirm(label)) return;
    this.adminuser.deleteUser(user.id).subscribe({
      next: () => this.fetchUsers(),
      error: (err) => console.error(err)
    });
  }
}
