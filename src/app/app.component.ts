import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import {
  Observable,
  Subject,
  BehaviorSubject,
  ReplaySubject,
  fromEvent
} from "rxjs";

import {
  debounceTime,
  map,
  switchMap,
  distinctUntilChanged,
  tap
} from "rxjs/operators";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  title = "rxjs";
  //observable$: any;
  mySubject$: any;
  searchSubject$ = new Subject<string>();
  results$: Observable<any>;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    /* this.observable$ = Observable.create(observer => {
      observer.next(1);
      observer.next(2);
      observer.next(3);
      observer.complete();
    });

    const subscribe = this.observable$.subscribe(
      val => {
        console.log(val);
      },
      err => {
        console.log(err);
      },
      () => {
        console.log("This is the end!");
      }
    ); */
    /* this.mySubject$ = new Subject();
    this.mySubject$.subscribe((x: any) => console.log(`first subscribe ${x}`));
    this.mySubject$.next(1);
    this.mySubject$.next(2);
    this.mySubject$.next(3);
    //this.mySubject$.unsubscribe();
    this.mySubject$.subscribe((x: any) => console.log(`second subscribe ${x}`));
    this.mySubject$.next(6); */
    /* this.mySubject$ = new BehaviorSubject(200);
    this.mySubject$.subscribe((x: any) => console.log(`first subscribe ${x}`));
    this.mySubject$.next(1);
    this.mySubject$.next(2);
    this.mySubject$.subscribe((x: any) => console.log(`second subscribe ${x}`));
    this.mySubject$.next(6); */
    /* this.mySubject$ = new ReplaySubject();
    this.mySubject$.subscribe((x: any) => console.log(`first subscribe ${x}`));
    this.mySubject$.next(1);
    this.mySubject$.next(2);
    this.mySubject$.subscribe((x: any) => console.log(`second subscribe ${x}`));
    this.mySubject$.next(6); */

    const clicksInDocument = fromEvent(document, "click"); // note optional configuration parameter
    // which will be passed to addEventListener
    //const clicksInDiv = fromEvent(document, "click");

    clicksInDocument.subscribe(() => console.log("document"));
    //clicksInDiv.subscribe(() => console.log("div"));

    /*     this.searchSubject$
      .pipe(debounceTime(500))
      .subscribe(x => console.log(`debounce time: ${x}`)); */

    this.results$ = this.searchSubject$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      tap(val => console.log(`BEFORE MAP: ${val}`)),
      switchMap(searchString => this.queryApi(searchString))
    );
  }

  ngOnDestroy() {
    // this.observable$.unsubscribe();
    // this.mySubject$.unsubscribe();
  }

  inputChanged($event: any) {
    console.log(`input changed ${$event}`);
    this.searchSubject$.next($event);
  }

  queryApi(searchString: string) {
    console.log(`query api: ${searchString}`);
    return this.http
      .get(`https://www.reddit.com/r/aww/search.json?q=${searchString}`)
      .pipe(map(result => result["data"]["children"]));
  }
}
