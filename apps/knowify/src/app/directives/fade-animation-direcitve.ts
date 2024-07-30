import {
  Directive,
  ElementRef,
  Input,
  Renderer2,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

@Directive({
  selector: '[appFadeAnimation]',
  standalone: true,
})
export class FadeAnimationDirective implements OnChanges {
  @Input() appFadeAnimation: boolean = false;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['appFadeAnimation'] || changes['duration']) {
      this.animate(this.appFadeAnimation);
    }
  }

  /**
   * Applies a fade-in or fade-out animation to the host element.
   *
   * @param {boolean} fadeIn - If true, applies a fade-in animation; otherwise, applies a fade-out animation.
   * @returns {void}
   *
   * This method uses the `data-duration` attribute of the element to determine the duration of the animation.
   * If no duration is specified, a default of 1 second is used.
   */
  private animate(fadeIn: boolean): void {
    const element = this.el.nativeElement;
    const duration = element.getAttribute('data-duration') || 1;
    const animationDuration = `${duration}s`;
    if (fadeIn) {
      this.renderer.setStyle(
        element,
        'animation',
        `fadeIn ${animationDuration} forwards`
      );
    } else {
      this.renderer.setStyle(
        element,
        'animation',
        `fadeOut ${animationDuration} forwards`
      );
    }
  }
}
