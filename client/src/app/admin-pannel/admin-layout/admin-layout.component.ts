import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss'
})
export class AdminLayoutComponent implements OnInit, OnDestroy {
  selectedPage = 'admin-layout';
  pageTitle = '';
  pageIcon = '';

  private sub!: Subscription;

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.readRouteData();
    this.sub = this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe(() => this.readRouteData());
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  private readRouteData(): void {
    let route = this.activatedRoute;
    while (route.firstChild) route = route.firstChild;
    const data = route.snapshot.data;
    this.pageTitle = data['title'] || '';
    this.pageIcon  = data['icon']  || '';
  }

  onItemSelected(key: string) {
    this.selectedPage = key;
  }
}
