import {run} from '@cycle/run'
import {makeDOMDriver, div, h3, i} from '@cycle/dom'
import {makeHTTPDriver} from '@cycle/http'
import xs from 'xstream'
import delay from 'xstream/extra/delay'

function Training(sources) {
  const props$ = sources.props
  const favorite$ = sources.DOM
    .select('.favorite')
    .events('click')
    .fold(acc => !acc)

  const state$ = xs.combine(props$, favorite$)
    .map( ([props, favorite]) => ({
      ...props,
      favorite,
    }))

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
  const view = [];
  const { isolateSource, isolateSink} = sources.DOM;
  for (const t of trainings) {
    const id = `training-${t.id}`
    const training = Training({ DOM: isolateSource(sources.DOM, id), props: xs.of(t) })
    view.push(isolateSink(training.DOM, id))
  }
  return xs
    .combine(...view)
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
