import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit, AfterViewInit, OnDestroy, ElementRef, Renderer2, ChangeDetectorRef } from "@angular/core";
import { Router } from "@angular/router";
import { interval, forkJoin, timer } from "rxjs";
import { distinctUntilChanged, takeUntil, filter, takeWhile, repeat, timeInterval, startWith, mergeMap, retryWhen, delayWhen } from "rxjs/operators";
import { Authority } from "src/app/core/enums/authority.enum";
import { AuthService } from "src/app/core/services/auth.service";


@Component({
  selector: 'app-dashboard',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css']
})
export class MainLayoutComponent implements OnInit, OnDestroy {


  currentUser = this.authService.getUserName();



  constructor(private authService: AuthService,
              private elementRef: ElementRef,
              private renderer: Renderer2,
              private router: Router,
              private cdr: ChangeDetectorRef,
            ) {
  }

  ngOnInit(): void {

  }



  ngOnDestroy(): void {

  }



}
