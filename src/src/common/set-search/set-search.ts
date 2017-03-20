import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { SearchSetPage } from '../../pages/search/search-set/search-set';
import { SetSearchResults } from '../../models/models';
import { SearchService } from '../../providers/search-service/search-service';

@Component({
  selector: 'set-search',
  templateUrl: 'set-search.html'
})
export class SetSearch implements OnInit {
  @Input() isOpened: boolean;
  @Input() initialSearch: string;
  @Input() isSearchSetPage: boolean;
  @Output() searchUpdated: EventEmitter<any>;
  @Output() queryUpdated: EventEmitter<any>;
  @ViewChild('setSearch') setSearchInput: any;
  private searchResults: Observable<SetSearchResults>;

  public isActive = false;

  constructor(private searchService: SearchService,
    private navCtrl: NavController,
    private navParams: NavParams,
    private viewCtrl: ViewController) {
    this.searchUpdated = new EventEmitter<any>();
    this.queryUpdated = new EventEmitter<any>();
  }

  ngOnInit() {
    this.isActive = !!this.isOpened;
  }

  ngAfterViewInit() {
    this.isActive && this.initializeInput();
  }

  public showSearchResults(query: string) {
    if (!this.isSearchSetPage) {
      this.goToSetsPage(query);

      return;
    }

    this.queryUpdated.emit(query);
    this.searchResults = this.getSearchResults(query);
    this.searchResults.subscribe((searchResults: SetSearchResults) => {
      this.searchUpdated.emit(searchResults);
    })
  }

  private initializeInput() {
    setTimeout(() => {
      if (this.setSearchInput) {
        this.setSearchInput.setFocus();

        if (this.initialSearch && this.isSearchSetPage) {
          this.setSearchInput.value = this.initialSearch;
        }
      }
    });
  }

  private getSearchResults(query: string): Observable<SetSearchResults> {
    return this.searchService.getSetSearchResults(query).share();
  }

  private goToSetsPage(query: string) {
    this.navCtrl.push(SearchSetPage, { query }).then(() => {
      const index = this.viewCtrl.index;
      this.navCtrl.remove(index);
    });
  }
}
