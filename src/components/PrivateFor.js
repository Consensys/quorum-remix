import React, { useEffect, useState } from 'react'
import Creatable from 'react-select/creatable/dist/react-select.esm'

export function PrivateFor ({ onChange, tesseraEndpoint }) {
  const [options, setOptions] = useState([])
  const [selection, setSelection] = useState([])


  const onChangeInternal = (options) => {
    setSelection(options)
    sendOptionsToParent(options)
  }
  const setOptionsAndsSelection = (parties) => {
    let privateFrom = ''
    if (!tesseraEndpoint.endsWith('/')) {
      tesseraEndpoint += '/'
    }
    const options = parties.map(party => {
      if (party.url === tesseraEndpoint) {
        console.log('Found our pub key', party.key)
        privateFrom = party.key
      }
      return createOption(party)
    })
      .sort((a, b) => a.label.localeCompare(b.label))

    setOptions(options)
  }

  function createOption (party) {
    return {
      value: party.key,
      label: `${party.url} (${party.key})`, // default to just the key
    }
  }

  function sendOptionsToParent (options) {
    const privateFor = options ? options.map(option => option.value) : []
    onChange({ privateFor })
  }

  useEffect(() => {
    const json = fetch(`${tesseraEndpoint}/partyinfo`)
      .then((response) => response.json())
      .then((json) => {

        console.log('got privateFor', json)
        const parties = json.keys
        setOptionsAndsSelection(parties)
      })
  }, [])

  return <Creatable options={options} className="private_for"
                    style={{ height: 450 }}
                    onChange={onChangeInternal}
                    value={selection}
                    classNamePrefix="private_for" isMulti autosize={false}/>
}
