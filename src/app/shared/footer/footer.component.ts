import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'sm-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
  imports: [CommonModule],
  standalone: true
})
export class FooterComponent implements OnInit {

  @Input() value = new Observable<string>();
  @Input() label: string = "";

  constructor() { }

  ngOnInit(): void {
  }
}
