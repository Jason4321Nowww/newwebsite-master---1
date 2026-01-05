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

  // 🔄 Order Tracking Alert after 20 seconds
startOrderTracking(orderId: string, orderService: any) {
  const interval = setInterval(() => {
    orderService.getOrderStatus(orderId).subscribe((res: { status: string }) => {

      if (res.status === 'pending') {
        this.toast('🕒 Order under process...');
      }

      if (res.status === 'paid') {
        this.toast('💰 Order paid. Preparing for shipment...');
      }

      if (res.status === 'shipped') {
        this.success('📦 Your order has been shipped!');
        clearInterval(interval); // stop tracking
      }

    });
  }, 5000); // checks every 5 seconds
}


}
