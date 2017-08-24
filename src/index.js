import {run} from '@cycle/run'
import {makeDOMDriver, div, h3, i} from '@cycle/dom'
import {makeHTTPDriver} from '@cycle/http'
import isolate from '@cycle/isolate';
import xs from 'xstream'
import delay from 'xstream/extra/delay'

function view(state$) {
  return state$.map(training =>
    div('.training.card.border-info', [
      div('.card-header.text-center', [
        h3('.training-title.card-title', training.title),
        training.favorite ? i('.fa.fa-heart.favorite') : i('.fa.fa-heart-o.favorite'),
      ]),
      div('.card-body', [
        div('.training-description.card-text', training.description)
      ]),
    ]))
}

function intent(sources) {
  return {
    props$: sources.props,
    favorite$: sources.DOM
      .select('.favorite')
      .events('click')
  }
}

function model(actions) {
  return xs.combine(actions.props$, actions.favorite$.fold(acc => !acc, false))
    .map(([props, favorite]) => ({
      ...props,
      favorite,
    }))
}
function Training(sources) {
  return {
    DOM: view(model(intent(sources))),
  }
}


function displayTrainings(trainings, sources) {
  return xs
    .combine(...trainings.map(t => isolate(Training)({ DOM: sources.DOM, props: xs.of(t) }).DOM))
    .map(trainings => div('#training-container', trainings))
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
