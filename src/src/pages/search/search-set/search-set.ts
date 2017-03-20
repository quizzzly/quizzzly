import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, InfiniteScroll } from 'ionic-angular';
import { Set } from '../../../models/models';
import { SetService } from '../../../providers/set-service/set-service';
import { SearchService } from '../../../providers/search-service/search-service';
import { SetSearchResults } from '../../../models/models';
import { Observable } from 'rxjs/Observable';

@Component({
  templateUrl: 'search-set.html'
})
export class SearchSetPage {
  query: string;
  searchResults: SetSearchResults;
  sets: Array<Set>;

  @ViewChild(InfiniteScroll)
  public infiniteScroll: InfiniteScroll;

  constructor(private navCtrl: NavController,
    private setService: SetService,
    private searchService: SearchService,
    private navParams: NavParams) {
    this.query = navParams.data.query; // is it save to show user input directly btw in ionic application?
  }

  ngAfterViewInit() {
    this.updateSets();
  }

  searchUpdated(searchResults: SetSearchResults) {
    this.sets = searchResults.sets;
    this.searchResults = searchResults;
    this.enableInfiniteScroll();
  }

  queryUpdated(query) {
    this.query = query;
  }

  private updateSets(): Observable<SetSearchResults> {
    const observable = this.searchService.getSetSearchResults(this.query).share();
    observable.subscribe(searchResults => this.searchUpdated(searchResults));
    return observable;
  }

  pullToRefresh(refresher) {
    this.updateSets().subscribe(() => {
      refresher.complete();
    });
  }

  loadMoreItems() {
    const currentPage = this.searchResults.page;
    this.searchService.getSetSearchResults(this.query, currentPage + 1).subscribe(searchResults => {
      this.searchResults = searchResults;
      this.sets.push(...searchResults.sets);
      this.updateInifiteScrollState(currentPage + 1 === this.searchResults.total_pages);
    });
  }

  private updateInifiteScrollState(finished: boolean) {
    if (this.infiniteScroll) {
      this.infiniteScroll.complete();
      this.infiniteScroll.enable(!finished);
    }
  }

  private enableInfiniteScroll() {
    if (this.infiniteScroll) {
      this.infiniteScroll.enable(this.searchResults.total_pages > 1);
    }
  }
}
