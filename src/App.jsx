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
import {
  server,
  // useHistogram
} from './hooks'
import useSWRMutation from 'swr/mutation'

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

  // const { mutate: saveHistogram } = useHistogram( state.textInput )
  async function saveHisto( url, { arg } ) {
    return fetch( url, {
      method: 'POST',
      body: JSON.stringify( { histogram: { corpus: arg } } )
    } ).then( res => res.json() )
  }
  const {
    trigger,
    // isMutating
  } = useSWRMutation( `${ server }/histogram`, saveHisto, /* options */ )

  const handleSaveHistogram = async () => await trigger( state.textInput )
  .then( ( response ) => {
    console.log( response );
    window.alert( `Success - view your histogram data at http://172.104.210.107/histogram/${ response.id }` );
  } )

  return <main>

    <form action={ handleSaveHistogram }>

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

      <input
        type="submit"
        value="Save"
        disabled={ state.exampleText != 'Custom input' }
      />

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
