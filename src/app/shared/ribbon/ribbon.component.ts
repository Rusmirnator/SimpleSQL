import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Command } from 'src/app/core/classes/command';
import { KeyGestureService } from 'src/app/core/services/key-gesture.service';
import { LoggerService } from 'src/app/core/services/logger.service';

@Component({
  selector: 'sm-ribbon',
  templateUrl: './ribbon.component.html',
  styleUrls: ['./ribbon.component.css'],
  imports: [CommonModule],
  standalone: true
})
export class RibbonComponent implements OnInit {

  @Input() commands?: Observable<Command[]> = new Observable<Command[]>();

  constructor(private _keyGestureService: KeyGestureService, private _logger: LoggerService) { }

  ngOnInit(): void {
    this._keyGestureService.registerGestureResolver((arg: string) => {
      this.commands?.subscribe(commands => {
        commands.find((c) => {
          return c.keyGesture === arg;
        })?.execute();
      });
      this._logger.logInfo(`KeyGesture request:${arg}`);
    });
  }

}
