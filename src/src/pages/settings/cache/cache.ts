import { Component } from '@angular/core';
import { ImageCacheService } from '../../../providers/image-cache-service/image-cache-service'
import { OfflineHttpService } from '../../../providers/offline-http-service/offline-http-service'
import { Observable } from 'rxjs/Rx';

@Component({
  templateUrl: 'cache.html'
})
export class CachePage {
  private cleaningCache: boolean

  constructor(
    private imageCacheService: ImageCacheService,
    private offlineHttpService: OfflineHttpService
  ) {}

  clearCache() {
    this.cleaningCache = true

    Observable
      .merge(
        this.imageCacheService.cleanCachedImages(),
        this.offlineHttpService.cleanCache()
      )
      .last()
      .subscribe(() => this.cleaningCache = false)
  }
}
