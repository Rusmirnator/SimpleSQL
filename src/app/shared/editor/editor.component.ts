import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { LoggerService } from 'src/app/base/services/logger.service';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {
  
  text?: string;
  
  @Output() editValue = new EventEmitter<string>();

  constructor(private _logger: LoggerService) { }

  ngOnInit(): void {
  }

  onF5KeyUp(event: KeyboardEvent) {
    if (event.key === 'F5') {
      this._logger.logInfo("Command executed");
    }
  }
}
