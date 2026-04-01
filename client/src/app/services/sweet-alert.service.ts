import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class SweetAlertService {

  success(message: string, title: string = 'Success') {
    Swal.fire({
      icon: 'success',
      title,
      text: message
    });
  }

  error(message: string, title: string = 'Error') {
    Swal.fire({
      icon: 'error',
      title,
      text: message
    });
  }

  warning(message: string, title: string = 'Warning') {
    Swal.fire({
      icon: 'warning',
      title,
      text: message
    });
  }

  info(message: string, title: string = 'Info') {
    Swal.fire({
      icon: 'info',
      title,
      text: message
    });
  }

  // 🔔 Bottom-right toast (for order alert)
  toast(message: string, icon: any = 'info') {
    Swal.fire({
      toast: true,
      position: 'bottom-end',
      showConfirmButton: false,
      timer: 4000,
      timerProgressBar: true,
      icon,
      title: message,
    });
  }

  // 🔄 Order Tracking — polls every 10s, stops after 2 min or on terminal status
  startOrderTracking(orderId: string, orderService: any) {
    const MAX_POLLS = 12; // 12 × 10s = 2 minutes
    let pollCount = 0;

    const interval = setInterval(() => {
      pollCount++;

      orderService.getOrderStatus(orderId).subscribe({
        next: (res: { status: string }) => {
          if (res.status === 'pending') {
            this.toast('🕒 Order under process...');
          } else if (res.status === 'paid') {
            this.toast('💰 Order paid. Preparing for shipment...');
          } else if (res.status === 'shipped') {
            clearInterval(interval);
            this.success('📦 Your order has been shipped!');
          } else {
            // Unknown terminal status — stop polling
            clearInterval(interval);
          }

          if (pollCount >= MAX_POLLS) {
            clearInterval(interval);
          }
        },
        error: () => {
          clearInterval(interval);
        }
      });
    }, 10000); // check every 10 seconds
  }


}
