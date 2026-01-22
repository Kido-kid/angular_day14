import { Routes } from '@angular/router';
import { CalculatorComponent } from './calculator/calculator.component';
import { CountdownTimerComponent } from './countdown-timer/countdown-timer.component';
import { StopwatchComponent } from './stopwatch/stopwatch.component';

export const routes: Routes = [
    {path:'calculator',component:CalculatorComponent},
    {path:'countdown', component:CountdownTimerComponent},
    {path:'stopwatch', component:StopwatchComponent}
];
