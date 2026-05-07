import { Injectable } from '@angular/core';

const STORAGE_KEY = 'bkp_visitor_id';

@Injectable({ providedIn: 'root' })
export class FingerprintService {

  private _id: string | null = null;

  get visitorId(): string {
    if (this._id) return this._id;

    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) { this._id = stored; return stored; }

    this._id = this.generate();
    localStorage.setItem(STORAGE_KEY, this._id);
    return this._id;
  }

  private generate(): string {
    // Combine stable browser traits into a hash, then append random suffix
    const traits = [
      navigator.userAgent,
      navigator.language,
      `${screen.width}x${screen.height}x${screen.colorDepth}`,
      String(new Date().getTimezoneOffset()),
      String(navigator.hardwareConcurrency ?? 0),
      String((navigator as any).deviceMemory ?? 0),
    ].join('||');

    let hash = 0;
    for (let i = 0; i < traits.length; i++) {
      hash = Math.imul(31, hash) + traits.charCodeAt(i) | 0;
    }

    const rnd = Math.random().toString(36).slice(2, 9);
    return `${Math.abs(hash).toString(36)}-${Date.now().toString(36)}-${rnd}`;
  }
}
