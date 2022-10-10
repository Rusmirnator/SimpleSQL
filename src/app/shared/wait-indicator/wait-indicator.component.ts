import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-wait-indicator',
  templateUrl: './wait-indicator.component.html',
  styleUrls: ['./wait-indicator.component.css'],
  imports: [CommonModule],
  standalone: true
})
export class WaitIndicatorComponent implements OnInit {

  @Input() isVisible: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

}
