import { useState } from 'react'
import Highcharts from 'highcharts/highstock'
import HighchartsReact from 'highcharts-react-official'
import 'highcharts/modules/histogram-bellcurve'

import './App.css'
import {
  bigramHisto,
  // splitText,
} from './utilities'
import { exampleTexts } from './exampleTexts'

function App() {

  const [ state, setState ] = useState( {
    exampleText: 'Custom input',
    textInput: '',
    minimumFrequency: 3,
  } );

  const histo = Object.entries( bigramHisto( state.textInput ) )
    .reduce( ( result, [ bigram, count ] ) => {
      if ( count >= state.minimumFrequency ) result.push( { bigram, count } );
      return result;
    }, [] )
    .sort( ( thisBigram, thatBigram ) => thisBigram.count < thatBigram.count )

  // console.log( {
  //   textInput: state.textInput,
  //   histo,
  //   // splitText: splitText( state.textInput ),
  // } )

  const highchartsOptions = {
    xAxis: {
      categories: histo.map( ( { bigram } ) => bigram ),
      crosshair: true,
      title: { text: '', },
    },
    yAxis: {
      allowDecimals: false,
      title: { text: 'Frequency', },
    },
    tooltip: {
      formatter: function() {
        return `${ this.category }: ${ this.options.y }`;
      },
    },
    series: [ {
        type: 'bar',
        height: '80%',
        data: histo.map( ( { count } ) => count ),
    } ],
    navigator: {
      xAxis: {
        labels: {
          formatter: function () {
            return this.count;
          },
        }
      },
      // yAxis: {},
    },
    rangeSelector: { enabled: false, },
    credits: { enabled: false, },
  };

  return <main>

    <form>

      <div>
        <label htmlFor='example-text'>Select an example text:</label>
        &nbsp;
        <select
          name='example-text'
          value={ state.exampleText }
          onChange={ ( { target } ) => {
            setState( {
              ...state,
              exampleText: target.value,
              textInput: exampleTexts[ target.value ],
            } )
          } }
        >
          { Object.keys( exampleTexts ).map( title => 
            <option key={ title } value={ title }>{ title }</option>
          ) }
        </select>
      </div>

      <div>
        <label htmlFor='minimum-freq'>Minimum bigram frequency to display:</label>
        &nbsp;
        <input
          type='number'
          name='minimum-freq'
          value={ state.minimumFrequency }
          onChange={ ( { target } ) =>
            setState( { ...state, minimumFrequency: parseInt( target.value ) } )
          }
          min={ 2 }
        />
      </div>

    </form>

    <hr />

    <section>

      <textarea
        value={ state.textInput }
        onChange={ ( { target } ) =>
          setState( { ...state, textInput: target.value } )
        }
        rows={ 40 }
        cols={ 80 }
      ></textarea>

      <HighchartsReact
        highcharts={ Highcharts }
        constructorType={ 'stockChart' }
        options={ highchartsOptions }
      />

    </section>

  </main>

}

export default App
