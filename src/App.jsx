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

  const [ exampleText, setExampleText ] = useState( 'Custom input' )
  const [ textInput, setTextInput ] = useState( '' )

  const histo = Object.entries( bigramHisto( textInput ) )
    .reduce( ( result, [ bigram, count ] ) => {
      if ( count > 2 ) result.push( { bigram, count } );
      return result;
    }, [] )
    .sort( ( thisBigram, thatBigram ) => thisBigram.count < thatBigram.count )

  // console.log( {
  //   textInput,
  //   histo,
  //   // splitText: splitText( textInput ),
  // } )

  const highchartsOptions = {
        xAxis: {
          categories: histo.map( ( { bigram } ) => bigram ),
          crosshair: true,
          title: { text: '', },
        },
        yAxis: {
          allowDecimals: false,
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

    <figure>

      <label htmlFor='example-text'>Select an example text:</label>
      &nbsp;
      <select
        name='example-text'
        value={ exampleText }
        onChange={ ( { target } ) => {
          console.log( target.value )
          setExampleText( target.value );
          setTextInput( exampleTexts[ target.value ] );
        } }
      >
        { Object.keys( exampleTexts ).map( title => <option
          key={ title }
          value={ title }
        >{ title }</option> ) }
      </select>

    </figure>

    <hr />

    <section>

      <textarea
        value={ textInput }
        onChange={ ( { target } ) => setTextInput( target.value ) }
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
