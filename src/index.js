import {run} from '@cycle/run'
import {makeDOMDriver, div} from '@cycle/dom'
import xs from 'xstream'

function main () {
  const vdom$ = xs.of(div('Hello World'))

  return {
    DOM: vdom$,
  }
}

const drivers = {
  DOM: makeDOMDriver('#app'),
}

run(main, drivers)
