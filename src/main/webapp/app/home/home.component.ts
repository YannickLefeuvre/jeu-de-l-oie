import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { ApplicationUser } from 'app/entities/application-user/application-user.model';
import { PlateauService } from 'app/entities/plateau/service/plateau.service';
import { Plateau } from 'app/entities/plateau/plateau.model';

@Component({
  selector: 'jhi-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  account: Account | null = null;
  appicationUser: ApplicationUser | null = null;
  plateau: Plateau | null = null;

  private readonly destroy$ = new Subject<void>();

  constructor(private accountService: AccountService, private router: Router, private plateauservice: PlateauService) {}

  ngOnInit(): void {
    this.accountService
      .getAuthenticationState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(account => ((this.account = account), this.getApplicationUser(account?.login ?? '')));

    this.redirectIfAccountIsNull();
  }

  login(): void {
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getApplicationUser(account: string): void {
    this.accountService
      .getApplicationUser(account)
      .pipe(takeUntil(this.destroy$))
      .subscribe(appicationUser => (this.appicationUser = appicationUser.body));
  }

  getPlateauPrincipal(): void {
    this.plateauservice
      .findPrincipal()
      .pipe(takeUntil(this.destroy$))
      .subscribe(plateau => (this.plateau = plateau.body));
  }

  redirectIfAccountIsNull(): void {
    if (this.account == null) {
      this.login();
    }
  }
}
