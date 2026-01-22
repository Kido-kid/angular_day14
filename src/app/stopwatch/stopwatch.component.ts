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
  private elapsed = 0; // keep track of accumulated time

  ngAfterViewInit(): void {
    const start$ = fromEvent(this.startBtn.nativeElement, 'click').pipe(
      switchMap(() =>
        interval(1000).pipe(
          map(i => this.elapsed + i + 1), // resume from elapsed
          takeUntil(merge(this.stop$, this.reset$)),
          startWith(this.elapsed) // show current immediately
        )
      )
    );

    start$.subscribe(val => {
      this.display.nativeElement.textContent = `${val}s`;
      this.elapsed = val; // update elapsed
    });

    fromEvent(this.stopBtn.nativeElement, 'click').subscribe(() => {
      this.stop$.next();
    });

    fromEvent(this.resetBtn.nativeElement, 'click').subscribe(() => {
      this.reset$.next();
      this.elapsed = 0;
      this.display.nativeElement.textContent = `0s`;
    });
  }
}
