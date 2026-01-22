import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { fromEvent, interval, map, switchMap, takeUntil, startWith, Subject, merge } from 'rxjs';

@Component({
  selector: 'app-stopwatch',
  standalone: true,
  templateUrl: './stopwatch.component.html',
  styleUrls: ['./stopwatch.component.scss']
})
export class StopwatchComponent implements AfterViewInit {
  @ViewChild('display') display!: ElementRef<HTMLLabelElement>;
  @ViewChild('startBtn') startBtn!: ElementRef<HTMLButtonElement>;
  @ViewChild('stopBtn') stopBtn!: ElementRef<HTMLButtonElement>;
  @ViewChild('resetBtn') resetBtn!: ElementRef<HTMLButtonElement>;

  private stop$ = new Subject<void>();
  private reset$ = new Subject<void>();
  private elapsed = 0; // total time accumulated

  ngAfterViewInit(): void {
    const start$ = fromEvent(this.startBtn.nativeElement, 'click').pipe(
      switchMap(() =>
        interval(1000).pipe(
          map(i => this.elapsed + i + 1), // continue from elapsed
          takeUntil(merge(this.stop$, this.reset$)),
          startWith(this.elapsed) // show immediately
        )
      )
    );

    start$.subscribe(val => {
      this.display.nativeElement.textContent = `${val}s`;
    });

    fromEvent(this.stopBtn.nativeElement, 'click').subscribe(() => {
      this.stop$.next();
      // save the current displayed value as elapsed
      const current = Number(this.display.nativeElement.textContent?.replace('s','')) || 0;
      this.elapsed = current;
    });

    fromEvent(this.resetBtn.nativeElement, 'click').subscribe(() => {
      this.reset$.next();
      this.elapsed = 0;
      this.display.nativeElement.textContent = `0s`;
    });
  }
}
