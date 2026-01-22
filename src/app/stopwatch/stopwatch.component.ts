import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { fromEvent, interval, map, switchMap, takeUntil, startWith, Subject, merge, scan } from 'rxjs';

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

  ngAfterViewInit(): void {
    const start$ = fromEvent(this.startBtn.nativeElement, 'click').pipe(
      switchMap(() =>
        interval(1000).pipe(
          // accumulate seconds
          scan((acc) => acc + 1, 0),
          takeUntil(merge(this.stop$, this.reset$)),
          startWith(0)
        )
      )
    );

    start$.subscribe(val => {
      this.display.nativeElement.textContent = `${val}s`;
    });

    fromEvent(this.stopBtn.nativeElement, 'click').subscribe(() => {
      this.stop$.next();
    });

    fromEvent(this.resetBtn.nativeElement, 'click').subscribe(() => {
      this.reset$.next();
      this.display.nativeElement.textContent = `0s`;
    });
  }
}
