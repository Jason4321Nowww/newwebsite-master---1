import { Component, OnInit } from '@angular/core';
import { ContactService } from '../services/contact.service';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss']
})
export class ContactFormComponent implements OnInit {
name: string = '';
email: string = '';
participation: string = 'member'; //by default

constructor(private contact:ContactService){}
 ngOnInit(): void {
    // Force smooth scroll to top whenever this component loads
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 0);
  }

onSubmit(): void{
     if (!this.name || !this.email || !this.participation) {
      alert('Bitte füllen Sie alle Felder aus.');
      return;
    }

    const contactData = {
      name: this.name,
      email: this.email,
      participation: this.participation
    };
    
    this.contact.submitContact(contactData).subscribe({
       next: (res) => {
        alert(res.message || 'Kontaktformular wurde erfolgreich gesendet!');
        this.name = '';
        this.email = '';
        this.participation = 'member';
      },
       error: (err) => {
        console.error(err);
        alert('Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.');
      }
    })
}

}
