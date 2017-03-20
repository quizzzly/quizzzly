import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, InfiniteScroll } from 'ionic-angular';
import { CommonConfiguration } from '../../config/config.ts';
import { FeedService } from '../../providers/feed-service/feed-service';
import { Set, Feed, FeedEntry, StudySession } from '../../models/models';
import { SetPage } from '../set/set';
import { Observable } from 'rxjs/Observable';

@Component({
  templateUrl: 'latest.html'
})
export class LatestPage implements OnInit {
  @ViewChild(InfiniteScroll)
  public infiniteScroll: InfiniteScroll;
  private itemsNavigation: Map<string, (any?) => void>;

  feed: Feed;
  isInitialLoadingInProgress: boolean;

  get showEmptyListMessage(): boolean {
    return !this.isInitialLoadingInProgress && this.feed !== null && this.feed.items.length === 0;
  }

  get showListAdditionalComponent(): boolean {
    return this.isInitialLoadingInProgress || this.showEmptyListMessage;
  }

  constructor(private navCtrl: NavController,
    private feedService: FeedService) {
    this.feed = null;
    this.initializeNavigation();
  }

  initializeNavigation() {
    this.itemsNavigation = new Map<string, (any?) => void>();
    this.itemsNavigation.set('set', this.gotoSetPage.bind(this));
    this.itemsNavigation.set('session', this.gotoSessionSetPage.bind(this));
  }

  private gotoSetPage(set: Set) {
    this.navCtrl.push(SetPage, set);
  }

  private gotoSessionSetPage(session: StudySession) {
    this.navCtrl.push(SetPage, session.set);
  }

  ngOnInit() {
    this.isInitialLoadingInProgress = true;
    this.updateFeed().subscribe(() => {
      this.updateInfiniteScrollState();
    }, () => {},
    () => {
      this.isInitialLoadingInProgress = false;
    });
  }

  onItemClick(item: FeedEntry) {
    let itemClickHandler = this.itemsNavigation.get(item.item_type);

    if (itemClickHandler) {
      itemClickHandler(item.item_data);
    }
  }

  pullToRefresh(refresher) {
    this.updateFeed().subscribe(() => {
      refresher.complete();
    });
  }

  private updateFeed(): Observable<Feed> {
    let observable = this.feedService.get().share();
    observable.subscribe(feed => {
      this.feed = feed;
    });

    return observable;
  }

  loadMoreItems() {
    this.feedService.get(this.feed).subscribe(feed => {
      if (!this.feed) {
        this.feed = feed;
        return;
      }

      this.feed.finished = feed.finished;
      this.feed.items.push(...feed.items);
      this.updateInfiniteScrollState();
    });
  }

  private updateInfiniteScrollState() {
    if (this.infiniteScroll) {
      this.infiniteScroll.complete();
      this.infiniteScroll.enable(!this.feed.finished);
    }
  }
}
