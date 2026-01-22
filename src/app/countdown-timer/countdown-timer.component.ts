import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { fromEvent, interval, map, switchMap, takeUntil, startWith, Subject } from 'rxjs';

@Component({
  selector: 'app-countdown-timer',
  standalone: true,
  templateUrl: './countdown-timer.component.html',
  styleUrls: ['./countdown-timer.component.scss']
})
export class CountdownTimerComponent implements AfterViewInit {
  @ViewChild('seconds') seconds!: ElementRef<HTMLInputElement>;
  @ViewChild('startBtn') startBtn!: ElementRef<HTMLButtonElement>;
  @ViewChild('resetBtn') resetBtn!: ElementRef<HTMLButtonElement>;
  @ViewChild('display') display!: ElementRef<HTMLLabelElement>;

  private reset$ = new Subject<void>();

  ngAfterViewInit(): void {
    const start$ = fromEvent(this.startBtn.nativeElement, 'click').pipe(
      switchMap(() => {
        const total = Number(this.seconds.nativeElement.value) || 0;
        return interval(1000).pipe(
          map(i => total - i),
          takeUntil(this.reset$),
          map(val => (val >= 0 ? val : 0)), // 👈 stop at 0
          startWith(total)
        );
      })
    );

    const resetClick$ = fromEvent(this.resetBtn.nativeElement, 'click').pipe(
      map(() => {
        this.reset$.next();
        return Number(this.seconds.nativeElement.value) || 0;
      })
    );

    start$.subscribe(val => {
      this.display.nativeElement.textContent = `Time: ${val}s`;
    });

    resetClick$.subscribe(val => {
      this.display.nativeElement.textContent = `Time: ${val}s`;
    });
  }
}
