

//#region 2. Create Observables

//<--------   Define the stream
const observable = Rx.Observable.create( observer => {
    observer.next( 'hello' )
    observer.next( 'world' )
})

observable.subscribe(val => console.log(val))
// hello
// world


//<--------  Observable from DOM Events
const clicks = Rx.Observable.fromEvent(document, 'click')

clicks.subscribe(click => console.log(click))
// click around the web page...
// MouseEvent<data>
// MouseEvent<data>


//<--------  Observable from Promise
const promise = new Promise((resolve, reject) => { 
    setTimeout(() => {
        resolve('resolved!')
    }, 1000)
});



const obsvPromise = Rx.Observable.fromPromise(promise)

obsvPromise.subscribe(result => console.log(result) ) 

// wail 1 second...
// resolved!


//<--------  Observable Timer

const timer = Rx.Observable.timer(1000)

timer.subscribe(done => console.log('ding!!!'))

//<-------- Observable Time Interval

const interval = Rx.Observable.interval(1000)

interval.subscribe(i => console.log( i ))
// 0
// 1
// every second for eternity...


//<--------  Observable of Static Values
const mashup = Rx.Observable.of('anything', ['you', 'want'], 23, true, {cool: 'stuff'})

mashup.subscribe(val => console.log( val ))
// anything
// you,want
// 23
// true
// [object Object]

//#endregion

//#region 3. Unsubscribe

//<-------- Turn off the stream

const timer = Rx.Observable.timer(1000);

timer
  .finally(() => console.log('All done!'))
  .subscribe()
// wait 1 second...
// All done!

const interval = Rx.Observable.interval(1000);
interval
  .finally(()  => console.log('All done!'))
  .subscribe(x => console.log(x))
// 0
// 1
// and so on...

const subscription = interval.subscribe()

subscription.unsubscribe()
// 'All Done'

//#endregion

//#region 4. Hot vs Cold Observables

//<--------  Cold  Observable example

const cold = Rx.Observable.create( (observer) => {
    observer.next( Math.random() )
});

cold.subscribe(a => console.log(`Subscriber A: ${a}`))
cold.subscribe(b => console.log(`Subscriber B: ${b}`))


// Subscriber A: 0.2298339030
// Subscriber B: 0.9720023832


//<--------  Hot Observable example

const x = Math.random()

const hot = Rx.Observable.create( observer => {
  observer.next( x )
});

hot.subscribe(a => console.log(`Subscriber A: ${a}`))
hot.subscribe(b => console.log(`Subscriber B: ${b}`))
// Subscriber A: 0.312580103
// Subscriber B: 0.312580103


//<-------- Making a cold observable hot

const cold = Rx.Observable.create( (observer) => {
    observer.next( Math.random() )
})

const hot = cold.publish()

hot.subscribe(a => console.log(`Subscriber A: {a}`))
hot.subscribe(b => console.log(`Subscriber B: {b}`))


hot.connect()

/// Subscriber A: 0.7122882102
/// Subscriber B: 0.7122882102


//#endregion

//#region 5. Map Control emmited values

const numbers = Rx.Observable.from([10, 100, 1000]);

numbers
  .map(num => Math.log(num) )
  .subscribe(x => console.log(x))
  // 2.3
  // 4.6
  // 6.9


  apiCall
  .map(json => JSON.parse(json) )
  .subscribe()

// emit as JS object, rather than useless JSON string


//#endregion

//#region 6. Do

/*
The do operator allows you to run code at any point in 
the Observable, without producing side effects on the 
emitted values. This is handy for debugging or for any 
situation where you want to run code outside of the 
Observable scope.
*/

const names = Rx.Observable.of('Simon', 'Garfunkle')

names
  .do(name  => console.log('original value', name) )
  .map(name => name.toUpperCase() )
  .do(name  => console.log('uppercase value', name) )
  .subscribe()
  // Simon
  // SIMON
  // Garfunkle
  // GARFUNKLE

//#endregion

//#region 7. Filter

const tweet = Rx.Observable.of(arrayOfTweetObjects)

tweet
  .filter(tweet => tweet.user == '@angularfirebase' )
  .subscribe()

//#endregion

//#region 8. First, Last

const names = Rx.Observable.of('Richard', 'Erlich', 'Dinesh', 'Gilfoyle')

names
  .first()
  .subscribe( n => console.log(n) )
// Richard


names
  .last()
  .subscribe( n => console.log(n) )
// Gilfoyle

//#endregion

//#region 9. Debounce ans Throttle

//<-------- Throttle - Give me the first value, then wait X time.
//<-------- Debounce - Wait X time, then give me the last value.
const mouseEvents = Rx.Observable.fromEvent(document, 'mousemove')

mouseEvents
  .throttleTime(1000)
  .subscribe()
// MouseEvent<data>
// wait 1 second...


mouseEvents
  .debounceTime(1000)
  .subscribe()
// wait 1 second...
// MouseEvent<data>

//#endregion

//#region 10. Scan

/*
It keeps track of the accumulated total 
of emitted values, so you can combine
 the emitted values from an observable together.
*/

const clicks = Rx.Observable.fromEvent(document, 'click')

clicks
  .map(e => Math.random() * 100 )
  .scan((totalScore, current) => totalScore + current)
  .subscribe()

//#endregion

//#region 11. SwitchMap

/*
 * switchMap is commonly required when dealing
 with async data from a database or API call. 
 For example, you need to get a user ID from an o
 bservable, then use it to query the database. 
 In this example, we reset an interval after each
  mouse click.
 */

  const clicks = Rx.Observable.fromEvent(document, 'click')


clicks.switchMap(click => {
    return Rx.Observable.interval(500)
})
.subscribe(i => print(i))

//#endregion

//#region 12. TakeUntil

// Get values until you’re told not to

const interval = Rx.Observable.interval(500)
const notifier = Rx.Observable.timer(2000)


interval
  .takeUntil(notifier)
  .finally(()  => print('Complete!'))
  .subscribe(i => print(i))
// 0
// 1
// 2
// Complete!

//#endregion

//#region 13. TakeWhile
// Get values while the conditions are right

const names = Rx.Observable.of('Sharon', 'Sue', 'Sally', 'Steve')

names
  .takeWhile(name => name != 'Sally')
  .finally(()  => console.log('Complete! I found Sally'))
  .subscribe(i => console.log(i))

//#endregion

//#region 14. Buffer

/*
 * Buffer is similar to debounce and throttle,
  but rather than filtering out data, it accumulates 
  it into an array, then emits the array. 
  There are many ways to buffer, but here we are 
  going to use bufferTime() and bufferCount(), 
  to buffer based on time or quantity.
 */

  const mouseEvents = Rx.Observable.fromEvent(document, 'mousemove')

mouseEvents
  .map(e => e.timeStamp.toFixed(0))
  .bufferTime(1000)
  .subscribe(batch => print(batch))
  // second 1 - [...values]
  // second 2 - [...values]

mouseEvents
  .bufferCount(5)
  .subscribe(batch => print(batch))
  // [...values] length 5
  // [...values] length 5

//#endregion

//#region 15. Zip
/*
 * Zip works well when you have complimentary 
Observables that you know have an equal number 
of values. It will combine the values by index 
location and emit them as a combined array.
 */
const yin   = Rx.Observable.of('peanut butter', 'wine','rainbows')
const yang  = Rx.Observable.of('jelly', 'cheese', 'unicorns')

const combo = Rx.Observable.zip(yin, yang)

combo.subscribe( arr => console.log(arr) )
// peanut butter, jelly
// wine, cheese
// rainbows, unicorns

//#endregion

//#region 16. ForkJoin
//<-------- Merge, wait for completion, emit last values together

/*
 * I think people like forkJoin() because 
of it’s cool name, but it seems to confuse
 people and shows up on StackOverflow way 
 more than it should. It’s similar to zip(), 
 but it waits for all observables to complete 
 then emits only the last values together.
 */

 let yin   = Rx.Observable.of('peanut butter', 'wine','rainbows')
let yang  = Rx.Observable.of('jelly', 'cheese', 'unicorns')

yang = yang.delay(2000)

const combo = Rx.Observable.forkJoin(yin, yang)

combo.subscribe( arr => console.log(arr) )
// wait 2 seconds...
// rainbows, unicorns

//#endregion

//#region 17. Catch

// Handle Errors Gracefully

const observable = Rx.Observable.create( observer => {
    observer.next( 'good' )
    observer.next( 'great' )
    observer.next( 'grand' )

    throw 'catch me!'

    observer.next( 'wonderful' )
})


observable
    .catch( err => print(`Error caught: ${err}`) )
    .subscribe( val => console.log(val) )
// good
// great
// grand
// Error caught: catch me!

//#endregion

//#region 18. Retry
/*
 *Let’s say we get an error from an API 
 on the initial request - it might just be a fluke. 
 Let’s give it a couple more tries before we give 
 up and complete the Observable.

*The basic retry() operator will try right away as 
 many times as you want. 
 */

 observable
 .catch( err => print(`Error caught: ${err}`) )
 .retry(2)
 .subscribe()

 // You can also use the retryWhen() operator to add some sophistication to a retry.

 observable
 .catch( err => print(`Error caught: ${err}`) )
 .retryWhen(err => err.message === 'server overload please try again' )
 .subscribe()

//#endregion

//#region 19. Subject

/*
 *An RxJS Subject is just an Observable with 
 the ability to call next() on itself to emit
 new values - in other words, it is an event emitter. 
 */
 const subject = new Rx.Subject()

 const subA = subject.subscribe( val => print(`Sub A: ${val}`) )
 const subB = subject.subscribe( val => print(`Sub B: ${val}`) )
 
 subject.next('Hello')
 
 
 setTimeout(() => {
     subject.next('World')
 }, 1000)
 
 // Sub A: Hello
 // Sub B: Hello
 // Sub A: World
 // Sub B: World
 


//#endregion

//#region 20. MultiCast

/* 
 *Subjects allow you broadcast values from a shared source,
  while limiting side effects to only one occurrence. 
  You start with a regular Observable, then multicast it to
  a Subject to be consumed by the end user. 
  This magic happens because a single shared subscription 
  is created to the underlying observable. 
*/
const observable = Rx.Observable.fromEvent(document, 'click');

const clicks = observable
                 .do( _ => print('SIDE EFFECT!!') )

const subject = clicks.multicast(() => new Rx.Subject() );

const subA = subject.subscribe( c => print(`Sub A: ${c.timeStamp}`) )
const subB = subject.subscribe( c => print(`Sub B: ${c.timeStamp}`) )

subject.connect();
// SIDE EFFECT!!
// Sub A: 2687.62
// Sub B: 2687.62

// SIDE EFFECT!!
// Sub A: 4295.11
// Sub B: 4295.11

//#endregion



