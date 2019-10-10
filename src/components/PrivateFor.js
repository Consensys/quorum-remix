import React, { useContext, useEffect, useState } from 'react'
import Creatable from 'react-select/creatable/dist/react-select.esm'
import { Store } from '../Store'

export function PrivateFor () {
  const { state, dispatch } = useContext(Store)
  const {
    network: {
      tesseraEndpoint,
    },
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
    if (!tesseraEndpoint) {
      return
    }
    fetch(`${tesseraEndpoint}/partyinfo`)
      .then((response) => response.json())
      .then((json) => {
        setOptions(json.keys.map(party => createOption(party))
        .sort((a, b) => a.label.localeCompare(b.label)))
      })
  }, [tesseraEndpoint])

  return <Creatable options={options} className="private_for"
                    style={{ height: 450 }}
                    onChange={(selection) => dispatch({
                      type: 'UPDATE_PRIVATE_FOR',
                      payload: selection && selection.map((option) => option.value)
                    })}
                    value={options.filter((option) => privateFor && privateFor.includes(option.value))}
                    classNamePrefix="private_for" isMulti autosize={false}/>
}
