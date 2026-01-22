import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { combineLatest, fromEvent, map, startWith } from 'rxjs';

@Component({
  selector: 'app-calculator',
  standalone: true,
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.scss']
})
export class CalculatorComponent implements AfterViewInit {
  @ViewChild('digit1') digit1!: ElementRef<HTMLInputElement>;
  @ViewChild('digit2') digit2!: ElementRef<HTMLInputElement>;
  @ViewChild('operator') operator!: ElementRef<HTMLSelectElement>;
  @ViewChild('result') result!: ElementRef<HTMLLabelElement>;

  ngAfterViewInit(): void {
    const digit1$ = fromEvent(this.digit1.nativeElement, 'input').pipe(
      map(() => Number(this.digit1.nativeElement.value) || 0),
      startWith(Number(this.digit1.nativeElement.value) || 0)
    );

    const digit2$ = fromEvent(this.digit2.nativeElement, 'input').pipe(
      map(() => Number(this.digit2.nativeElement.value) || 0),
      startWith(Number(this.digit2.nativeElement.value) || 0)
    );

    const operator$ = fromEvent(this.operator.nativeElement, 'change').pipe(
      map(() => this.operator.nativeElement.value),
      startWith(this.operator.nativeElement.value) 
    );

    const calculation$ = combineLatest([digit1$, digit2$, operator$]).pipe(
      map(([d1, d2, op]) => {
        switch (op) {
          case 'sum': return d1 + d2;
          case 'sub': return d1 - d2;
          case 'product': return d1 * d2;
          case 'division': return d2 !== 0 ? d1 / d2 : 'Infinity';
          default: return 0;
        }
      })
    );

    calculation$.subscribe(result => {
      this.result.nativeElement.textContent = `Result: ${result}`;
    });
  }
}