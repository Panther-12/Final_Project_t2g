import { Injectable } from '@angular/core';
import { BehaviorSubject, timer } from 'rxjs';
import { take } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(false);

  loading$ = this.loadingSubject.asObservable();

  constructor() {}

  showLoading() {
    this.loadingSubject.next(true);
  }

  hideLoading() {
    this.loadingSubject.next(false);
  }

  hideLoadingAfterDelay(delaySeconds: number = 3) {
    timer(delaySeconds * 1000).pipe(take(1)).subscribe(() => {
      this.loadingSubject.next(false);
    });
  }
}
