import React, { useContext, useEffect, useState } from 'react'
import Creatable from 'react-select/creatable/dist/react-select.esm'
import { Store } from '../Store'

export function PrivateFor ({ onChange, tesseraEndpoint }) {
  const { state, dispatch } = useContext(Store)
  const {
    txMetadata: {
      privateFor
    }
  } = state
  const [options, setOptions] = useState([])


  function createOption (party) {
    return {
      value: party.key,
      label: `${party.url} (${party.key})`, // default to just the key
    }
  }

  useEffect(() => {
    const json = fetch(`${tesseraEndpoint}/partyinfo`)
      .then((response) => response.json())
      .then((json) => {

        console.log('got privateFor', json)
        const parties = json.keys
        let privateFrom = ''
        if (!tesseraEndpoint.endsWith('/')) {
          tesseraEndpoint += '/'
        }
        const formattedParties = parties.map(party => {
          if (party.url === tesseraEndpoint) {
            console.log('Found our pub key', party.key)
            privateFrom = party.key
          }
          return createOption(party)
        })
          .sort((a, b) => a.label.localeCompare(b.label))

        setOptions(formattedParties)
      })
  }, [])

  return <Creatable options={options} className="private_for"
                    style={{ height: 450 }}
                    onChange={(selection) => dispatch({
                      type: 'UPDATE_PRIVATE_FOR',
                      payload: selection && selection.map((option) => option.value)
                    })}
                    value={options.filter((option) => privateFor && privateFor.includes(option.value))}
                    classNamePrefix="private_for" isMulti autosize={false}/>
}
