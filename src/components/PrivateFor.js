import React, { useEffect, useState } from 'react'
import Creatable from 'react-select/creatable/dist/react-select.esm'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { updatePrivateFor } from '../actions'

export function PrivateFor () {
  const state = useSelector(state => state)
  const dispatch = useDispatch()
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
      setOptions([])
      return
    }
    axios.get(`${tesseraEndpoint}/partyinfo`)
    .then((response) => {
      setOptions(response.data.keys.map(party => createOption(party))
        .sort((a, b) => a.label.localeCompare(b.label)))
      })
  }, [tesseraEndpoint])

  return <Creatable options={options}
                    className="private_for"
                    placeholder="Select or add..."
                    onChange={(selection) => dispatch(updatePrivateFor(selection))}
                    value={options.filter((option) => privateFor && privateFor.includes(option.value))}
                    classNamePrefix="private_for" isMulti autosize={false}/>
}
