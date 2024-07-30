import { Component, Input } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'region-info',
  standalone: true,
  imports: [ MatIconModule, MatTooltipModule],
  templateUrl: './region-info.component.html',
  styleUrls: ['./region-info.component.scss']
})
export class RegionInfoComponent {
  @Input() regionName: string = '';
  @Input() tooltipText: string = '';
}
