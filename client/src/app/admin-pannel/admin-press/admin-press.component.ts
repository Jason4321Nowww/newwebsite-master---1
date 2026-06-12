import { Component, ElementRef, ViewChild, OnInit, HostListener } from '@angular/core';
import { AdminpressService } from '../admin-services/adminpress.service';
import { PressRelease } from '../../_models/press';
import { AdminemailService } from '../admin-services/adminemail.service';
declare var require: any;
const html2pdf = require('html2pdf.js');

@Component({
  selector: 'app-admin-press',
  templateUrl: './admin-press.component.html',
  styleUrls: ['./admin-press.component.scss']
})
export class AdminPressComponent implements OnInit {
  title = '';
  title_it = '';
  title_fr = '';
  title_en = '';
  content = '';
  content_it = '';
  content_fr = '';
  content_en = '';
  image: File | null = null;
  activeLang: string = 'de';
  readonly langMeta: Record<string, { label: string; flag: string }> = {
    de: { label: 'Deutsch (DE)', flag: 'assets/images/flags/de.svg' },
    it: { label: 'Italiano (IT)', flag: 'assets/images/flags/it.svg' },
    fr: { label: 'Français (FR)', flag: 'assets/images/flags/fr.svg' },
    en: { label: 'English (EN)', flag: 'assets/images/flags/gb.svg' },
  };
  selectedLangs: string[] = ['de'];

  showLangDropdown = false;

  get availableLangs(): string[] {
    return ['de', 'it', 'fr', 'en'].filter(l => !this.selectedLangs.includes(l));
  }

  @HostListener('document:click')
  closeLangDropdown(): void {
    this.showLangDropdown = false;
  }

  email = '';
  pressReleases: PressRelease[] = [];
  selectedRelease: PressRelease | null = null;
  selectedRecipients: string[] = [];
  emails: any[] = [];
  lists: string[] = [];
  sendLang: string = 'de';
// sendImage: File | null = null;




  @ViewChild('pdfContent', { static: false }) pdfContent!: ElementRef;

  constructor(private pressService: AdminpressService, private emailService:AdminemailService) {}

  ngOnInit(): void {
    this.loadPressReleases();
  }

  get contentWithBreaks(): string {
    return this.content.replace(/\n/g, '<br>');
  }

  onLangChange(lang: string): void {
    this.activeLang = lang;
    if (!this.selectedLangs.includes(lang)) {
      this.selectedLangs.push(lang);
    }
  }

  removeLang(lang: string): void {
    if (lang === 'de') return;
    this.selectedLangs = this.selectedLangs.filter(l => l !== lang);
    (this as any)[`title_${lang}`] = '';
    (this as any)[`content_${lang}`] = '';
    if (this.activeLang === lang) this.activeLang = 'de';
  }

 submit() {
  if (!this.title || !this.content || !this.image) {
    alert('Please fill all fields');
    return;
  }

  const formData = new FormData();
  formData.append('title', this.title);
  formData.append('title_it', this.title_it || '');
  formData.append('title_fr', this.title_fr || '');
  formData.append('title_en', this.title_en || '');
  formData.append('content', this.contentWithBreaks);
  formData.append('content_it', this.content_it.replace(/\n/g, '<br>') || '');
  formData.append('content_fr', this.content_fr.replace(/\n/g, '<br>') || '');
  formData.append('content_en', this.content_en.replace(/\n/g, '<br>') || '');
  formData.append('image', this.image);

  this.pressService.createRelease(formData).subscribe(() => {
    alert('✅ Press release saved');
    this.loadPressReleases();
    this.title = '';
    this.title_it = '';
    this.title_fr = '';
    this.title_en = '';
    this.content = '';
    this.content_it = '';
    this.content_fr = '';
    this.content_en = '';
    this.image = null;
    this.activeLang = 'de';
    this.selectedLangs = ['de'];
  });
}



deletePress(id: string) {
  if (!confirm('⚠️ Are you sure you want to delete this press release?')) {
    return;
  }

  this.pressService.deleteRelease(id).subscribe({
    next: () => {
      alert('✅ Press release deleted');
      this.loadPressReleases(); // refresh list
    },
    error: (err) => {
      console.error('❌ Delete failed:', err);
      alert('Failed to delete press release');
    }
  });
}



onImageSelected(event: any) {
  this.image = event.target.files[0];
}


  loadPressReleases() {
    this.pressService.getAllReleases().subscribe(data => this.pressReleases = data);
  }



  /** Returns languages that have both title and content filled in for this release */
  getAvailableSendLangs(release: PressRelease): { code: string; label: string; flag: string }[] {
    const all = [
      { code: 'de', title: release.title,    content: release.content    },
      { code: 'it', title: release.title_it,  content: release.content_it  },
      { code: 'fr', title: release.title_fr,  content: release.content_fr  },
      { code: 'en', title: release.title_en,  content: release.content_en  },
    ];
    return all
      .filter(l => l.title && l.content)
      .map(l => ({ code: l.code, ...this.langMeta[l.code] }));
  }

  /** Returns the title/content for the currently selected send language */
  private getLangContent(release: PressRelease, lang: string): { title: string; content: string } {
    if (lang === 'de') return { title: release.title, content: release.content };
    return {
      title:   (release as any)[`title_${lang}`]   || release.title,
      content: (release as any)[`content_${lang}`] || release.content,
    };
  }

openEmailDialog(release: PressRelease) {
  this.selectedRelease = release;
  // Default to first available language
  const available = this.getAvailableSendLangs(release);
  this.sendLang = available.length ? available[0].code : 'de';

  this.selectedRecipients = [];
  this.emailService.getAllEmails().subscribe((data: any) => this.emails = data);
  this.emailService.getLists().subscribe((lists: any) => this.lists = lists);
}


onSelectChange(event: Event) {
  const select = event.target as HTMLSelectElement;
  const selectedValues = Array.from(select.selectedOptions).map(o => o.value);

  this.selectedRecipients = [];

  selectedValues.forEach(val => {
    if (val.startsWith('list:')) {
      // If it's a list, add all emails in that list
      const listName = val.replace('list:', '');
      const emailsInList = this.emails
        .filter(e => e.lists?.includes(listName))
        .map(e => e.email);
      this.selectedRecipients.push(...emailsInList);
    } else if (val.startsWith('email:')) {
      // If it's an individual email
      const email = val.replace('email:', '');
      this.selectedRecipients.push(email);
    }
  });

  // Remove duplicates
  this.selectedRecipients = Array.from(new Set(this.selectedRecipients));
}




selectList(listName: string) {
  this.selectedRecipients = this.emails
    .filter(e => e.lists?.includes(listName))
    .map(e => e.email);
}


  cancelSend() {
    this.selectedRelease = null;
  }

convertImageToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result!.toString());
    reader.onerror = error => reject(error);
  });
}


async confirmSend() {
  if (!this.selectedRelease) return;

  const release = this.selectedRelease;
  const { title: langTitle, content: langContent } = this.getLangContent(release, this.sendLang);

  const leftFlag = '../../../assets/logo/starlinelessbiggertransparent.png';
  const rightFlag = '../../../assets/logo/starlinelessbiggertransparent.png';
  const d = new Date(release.date);
  const releaseDate = `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`;

  const calendarIconSVG = `
    <svg xmlns="http://www.w3.org/2000/svg" height="18" viewBox="0 0 24 24" width="18" fill="#666" style="margin-right: 6px;">
      <path d="M0 0h24v24H0z" fill="none"/>
      <path d="M19 4h-1V2h-2v2H8V2H6v2H5
               c-1.1 0-2 .9-2 2v14a2 2 0 002 2h14
               a2 2 0 002-2V6c0-1.1-.9-2-2-2zm0
               16H5V9h14v11zm0-13H5V6h14v1z"/>
    </svg>
  `;

const pressImageHtml = release.image
  ? `
    <div style="text-align:center; margin: 20px 0;">
      <img
        src="${release.image}"
        style="display:inline-block;width:auto;max-width:100%;max-height:320px;border-radius:8px;box-shadow:0 2px 10px rgba(0,0,0,0.15);"
        crossOrigin="anonymous"
      />
    </div>
  `
  : '';





  const contentHtml = `
    <div style="max-width: 900px; margin: auto; padding: 40px; font-family: 'Georgia', serif; background: #ffffff; border-radius: 12px; box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08); line-height: 1.8; color: #222; text-align: justify;">
      <div style="display: flex; align-items: center; justify-content: center; gap: 30px; margin-bottom: 30px;">
        <img src="${leftFlag}" style="height: 50px;" crossOrigin="anonymous"/>
        <h1 style="margin: 0; font-size: 1.5rem; font-weight: 500; text-align: center; color: #2c3e50;">${langTitle}</h1>
        <img src="${rightFlag}" style="height: 50px;" crossOrigin="anonymous"/>
      </div>
      <hr style="border: none; border-top: 2px solid #aaa; margin: 20px 0;" />
       ${pressImageHtml}
      <div style="font-size: 1rem; margin-bottom: 30px;">${langContent}</div>

      <div style="display: flex; align-items: center; font-size: 0.95rem; color: #555; font-style: italic; border-left: 4px solid #ccc; padding-left: 8px; max-width: 300px;">
        ${calendarIconSVG}<span>${releaseDate}</span>
      </div>
    </div>
  `;

  const container = document.createElement('div');
  container.innerHTML = contentHtml;
  document.body.appendChild(container);

  const opt = {
    margin: 0,
    filename: 'press-release.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, allowTaint: true },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  try {
    const pdfBlob: Blob = await html2pdf().set(opt).from(container).outputPdf('blob');
    document.body.removeChild(container);

    const reader = new FileReader();
    reader.readAsDataURL(pdfBlob);

    reader.onloadend = async () => {
      const base64 = reader.result?.toString().split(',')[1];

      if (!base64) {
        console.error('❌ Failed to generate PDF content.');
        return;
      }





      console.log('Sending emails to recipients...');

      for (const email of this.selectedRecipients) {
        try {
          await this.pressService.sendRelease(release._id!, {
            email,
            pdfBase64: base64,
            lang: this.sendLang,
            langTitle,
          }).toPromise();
          console.log(`✅ Email sent to: ${email}`);
        } catch (err) {
          console.error(`❌ Failed to send email to: ${email}`, err);
        }
      }

      console.log('All emails processed.');
      alert('✅ Emails processed. Check console for details.');
      this.selectedRelease = null;
    };

  } catch (error) {
    console.error('❌ Error generating PDF:', error);
    document.body.removeChild(container);
  }
}



autoGrowTextArea(element: HTMLTextAreaElement) {
  element.style.height = 'auto';
  element.style.height = element.scrollHeight + 'px';
}


}
