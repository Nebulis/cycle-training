import {run} from '@cycle/run'
import {makeDOMDriver, div, h3, i} from '@cycle/dom'
import {makeHTTPDriver} from '@cycle/http'
import isolate from '@cycle/isolate';
import xs from 'xstream'
import delay from 'xstream/extra/delay'

// TODO 1 view
// TODO 2 intent
// TODO 3 model

function Training(sources) {
  // TODO 2 intent
  const props$ = sources.props
  const favorite$ = sources.DOM
    .select('.favorite')
    .events('click')
    .fold(acc => !acc, false)

  // TODO 3 model
  const state$ = xs.combine(props$, favorite$)
    .map( ([props, favorite]) => ({
      ...props,
      favorite,
    }))

  // TODO 1 view
  const vdom$ = state$.map(training =>
    div(`.training.card.border-info`, [
      div('.card-header.text-center', [
        h3('.training-title.card-title', training.title),
        training.favorite ? i('.fa.fa-heart.favorite') : i('.fa.fa-heart-o.favorite'),
      ]),
      div('.card-body', [
        div('.training-description.card-text', training.description)
      ]),
    ]))

  return {
    DOM: vdom$,
  }
}


function displayTrainings(trainings, sources) {
  return xs
    .combine(...trainings.map(t => isolate(Training)({ DOM: sources.DOM, props: xs.of(t) }).DOM))
    .map(trainings => div('#training-container', trainings));
}

function main (sources) {
  const request$ = xs.of({
    url: '/training.json', // GET method by default
    category: 'training',
  });

  const response$ = sources.HTTP
    .select('training')
    .flatten();

  const vdom$ = response$
    .map(res => res.body)
    .map(t => displayTrainings(t, sources))
    .flatten()

  return {
    DOM: vdom$,
    HTTP: request$,
  }
}

const drivers = {
  DOM: makeDOMDriver('#app'),
  HTTP: makeHTTPDriver(),
}

run(main, drivers)
