import { Directive, ElementRef, Input, Renderer2, OnChanges, SimpleChanges, HostBinding } from '@angular/core';

@Directive({
  selector: '[appFadeAnimation]',
  standalone: true
})
export class FadeAnimationDirective implements OnChanges {
  @Input() appFadeAnimation: boolean = false; // True para fade-in, false para fade-out

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['appFadeAnimation'] || changes['duration']) {
      this.animate(this.appFadeAnimation);
    }
  }

  private animate(fadeIn: boolean): void {
    const element = this.el.nativeElement;
    const duration = element.getAttribute('data-duration') || 1; // Lee la duración del atributo data-duration, valor predeterminado es 1 segundo
    const animationDuration = `${duration}s`;
    if (fadeIn) {
      this.renderer.setStyle(element, 'animation', `fadeIn ${animationDuration} forwards`);
    } else {
      this.renderer.setStyle(element, 'animation', `fadeOut ${animationDuration} forwards`);
    }
  }
}
