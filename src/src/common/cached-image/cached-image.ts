import { Directive, ElementRef, Input } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { ImageCacheService } from '../../providers/image-cache-service/image-cache-service'

@Directive({
    selector: '[cached-image]'
})
export class CachedImage {
  @Input('image-src') imageSrc: string;

  private subscription: Subscription;

  constructor(
    private element: ElementRef,
    private imageCacheService: ImageCacheService
  ) {
    this.subscription = new Subscription()
  }

  ngAfterContentInit() {
    this.loadWithCache()
  }

  ngOnChanges() {
    this.unsubscribe()
    this.loadWithCache()
  }

  ngOnDestroy() {
    this.unsubscribe()
  }

  private loadWithCache() {
    if (!this.imageSrc) {
      return
    }

    this.subscription = this.imageCacheService
      .loadWithCache(this.imageSrc)
      .subscribe(src => this.element.nativeElement.src = src, error => console.log('CachedImage ' + JSON.stringify(error)))
  }

  private unsubscribe() {
    this.subscription && this.subscription.unsubscribe()
  }
}
