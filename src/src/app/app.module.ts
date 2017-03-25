import { NgModule, ErrorHandler } from '@angular/core';
import { IonicStorageModule } from '@ionic/storage';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { ClassesPage } from '../pages/classes/classes';
import { MainPage } from '../pages/main/main';
import { LatestPage } from '../pages/latest/latest';
import { SetsPage } from '../pages/sets/sets';
import { QuizletClassPage } from '../pages/quizlet-class/quizlet-class';
import { CardsPage } from '../pages/cards/cards';
import { CardsOptionsPage } from '../pages/cards/options/options';
import { MatchPage } from '../pages/match/match';
import { MatchOptionsPage } from '../pages/match/options/options';
import { MatchResultsPage } from '../pages/match/results/matchResults';
import { LearnPage } from '../pages/learn/learn';
import { LearnOptionsPage } from '../pages/learn/options/options';
import { LearnResultsPage } from '../pages/learn/results/learnResults';
import { TestPage } from '../pages/test/test/test';
import { TestResultsPage } from '../pages/test/test-results/test-results';
import { TestSetupPage } from '../pages/test/test-setup/test-setup';
import { Multiple } from '../pages/test/test/multiple/multiple';
import { TrueFalse } from '../pages/test/test/true-false/true-false';
import { Written } from '../pages/test/test/written/written';
import { DefinitionCard } from '../pages/test/test/definition-card/definition-card';
import { SetPage } from '../pages/set/set';
import { CreateSetPage } from '../pages/create-set/create-set';
import { LoginPage } from '../pages/login/login';
import { SettingsPage } from '../pages/settings/settings';
import { AboutPage } from '../pages/settings/about/about';
import { ContactPage } from '../pages/settings/contact/contact';
import { CachePage } from '../pages/settings/cache/cache';
import { TabsPage } from '../pages/settings/tabs/tabs';
import { SearchSetPage } from '../pages/search/search-set/search-set';

import { ListAdditionalComponent } from '../common/list-additional-component/list-additional-component';
import { SetListItem } from '../common/set-list-item/set-list-item';
import { SetList } from '../common/set-list/set-list';
import { CachedImage } from '../common/cached-image/cached-image';
import { CachedBackgroundImage } from '../common/cached-image/cached-background-image';
import { SetSearch } from '../common/set-search/set-search';
import { ProgressBar } from '../common/progress-bar/progress-bar';
import { GoToCreateSetButton } from '../common/go-to-create-set-button/go-to-create-set-button';

import { SplashScreen } from '@ionic-native/splash-screen'
import { StatusBar } from '@ionic-native/status-bar'
import { AppVersion } from '@ionic-native/app-version'
import { InAppBrowser } from '@ionic-native/in-app-browser'
import { SecureStorage } from '@ionic-native/secure-storage'
import { Transfer } from '@ionic-native/transfer'
import { File } from '@ionic-native/file'
import { Network } from '@ionic-native/network'

import { NetworkStatusService } from '../providers/network-status-service/network-status-service'
import { SerializationService } from '../providers/serialization-service/serialization-service';
import { CustomHttpService } from '../providers/custom-http-service/custom-http-service';
import { AuthenticationService } from '../providers/authentication-service/authentication-service';
import { OfflineHttpService } from '../providers/offline-http-service/offline-http-service'
import { ImageCacheService } from '../providers/image-cache-service/image-cache-service'
import { FeedService } from '../providers/feed-service/feed-service';
import { ClassService } from '../providers/class-service/class-service';
import { SetService } from '../providers/set-service/set-service';
import { LanguageService } from '../providers/language-service/language-service';
import { SearchService } from '../providers/search-service/search-service';

@NgModule({
  declarations: [
    MyApp,
    MainPage,
    LatestPage,
    ClassesPage,
    SetsPage,
    QuizletClassPage,
    CardsPage,
    CardsOptionsPage,
    MatchPage,
    MatchOptionsPage,
    MatchResultsPage,
    LearnPage,
    LearnOptionsPage,
    LearnResultsPage,
    TestPage,
    TestResultsPage,
    TestSetupPage,
    Multiple,
    TrueFalse,
    Written,
    DefinitionCard,
    SetPage,
    CreateSetPage,
    LoginPage,
    SettingsPage,
    AboutPage,
    ContactPage,
    CachePage,
    TabsPage,
    SearchSetPage,

    ListAdditionalComponent,
    SetList,
    SetListItem,
    SetSearch,
    GoToCreateSetButton,
    ProgressBar,
    CachedImage,
    CachedBackgroundImage
  ],
  imports: [
    // https://ionicframework.com/docs/v2/api/config/Config/
    IonicModule.forRoot(MyApp, {
      backButtonText: 'Back',
      iconMode: 'md', //The mode to use for all icons throughout the application. Available options: "ios", "md"
      mode: 'ios',
      modalEnter: 'modal-slide-in',
      modalLeave: 'modal-slide-out',
      tabsLayout: 'icon-top',
      tabsPlacement: 'top',
      pageTransition: 'windows'
    }),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    MainPage,
    LatestPage,
    ClassesPage,
    SetsPage,
    QuizletClassPage,
    CardsPage,
    CardsOptionsPage,
    MatchPage,
    MatchOptionsPage,
    MatchResultsPage,
    LearnPage,
    LearnOptionsPage,
    LearnResultsPage,
    TestPage,
    TestResultsPage,
    TestSetupPage,
    Multiple,
    TrueFalse,
    Written,
    DefinitionCard,
    SetPage,
    CreateSetPage,
    LoginPage,
    SettingsPage,
    AboutPage,
    ContactPage,
    CachePage,
    TabsPage,
    SearchSetPage,

    ListAdditionalComponent,
    SetList,
    SetListItem,
    GoToCreateSetButton,
    ProgressBar
  ],
  providers: [
    Transfer,
    File,
    SplashScreen,
    StatusBar,
    AppVersion,
    InAppBrowser,
    SecureStorage,
    Network,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    NetworkStatusService,
    OfflineHttpService,
    FeedService,
    ClassService,
    SetService,
    CustomHttpService,
    AuthenticationService,
    SerializationService,
    LanguageService,
    ImageCacheService,
    SearchService
  ]
})
export class AppModule {}
