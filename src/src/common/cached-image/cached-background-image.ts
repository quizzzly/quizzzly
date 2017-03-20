import { Directive, ElementRef, Input } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { ImageCacheService } from '../../providers/image-cache-service/image-cache-service'

@Directive({
    selector: '[cached-background-image]'
})
export class CachedBackgroundImage {
  @Input('image-src') imageSrc: string;

  private subscription: Subscription;

  constructor(
    private element: ElementRef,
    private imageCacheService: ImageCacheService
  ) {
    this.subscription = new Subscription()
  }

  ngAfterContentInit() {
    if (!this.imageSrc) {
      return
    }

    this.subscription = this.imageCacheService
      .loadWithCache(this.imageSrc)
      .subscribe(
        src => this.element.nativeElement.style.backgroundImage = `url(${src})`,
        error => console.log('CachedImage ' + JSON.stringify(error))
      )
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }
}
