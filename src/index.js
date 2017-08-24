import {run} from '@cycle/run'
import {makeDOMDriver, div} from '@cycle/dom'
import {makeHTTPDriver} from '@cycle/http'
import xs from 'xstream'
import delay from 'xstream/extra/delay'

function main (sources) {
  // TODO 1 create request to /training.json

  // TODO 3 listen for HTTP response (don't forget flatten at the end)

  // TODO 4 display the numbers of elements
  // TODO 5 add delay
  const vdom$ = xs.of(div('Hello World'))

  return {
    DOM: vdom$,
  }
}

// TODO 2 create HTTP driver
const drivers = {
  DOM: makeDOMDriver('#app'),
}

run(main, drivers)
