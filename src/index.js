import {run} from '@cycle/run'
import {makeDOMDriver, div, h3, i} from '@cycle/dom'
import {makeHTTPDriver} from '@cycle/http'
import xs from 'xstream'
import delay from 'xstream/extra/delay'

function displayTrainings(trainings) {
  const view = [];
  for (const t of trainings) {
    view.push(div(`.training.card.border-info`, [
      div('.card-header.text-center', [
        h3('.training-title.card-title', t.title),
        i('.fa.fa-heart.favorite'),
      ]),
      div('.card-body', [
        div('.training-description.card-text', t.description)
      ]),
    ]))
  }
  return div('#training-container', view);
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
    .map(displayTrainings)

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
