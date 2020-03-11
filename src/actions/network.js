import { getAccounts, getTesseraParties, getTesseraKeys, updateWeb3Url, updateTesseraUrl } from '../api'
import { setTesseraParties, setTesseraKeys } from './tessera'
import { setError } from './error'
import { resetTransactionResults } from './contracts'

export function editNetwork (edit) {
  return { type: 'EDIT_NETWORK', payload: edit }
}

function setNetwork (endpoint, tesseraEndpoint, accounts, status, editing) {
  return {
    type: 'SET_NETWORK',
    payload: {
      endpoint,
      tesseraEndpoint,
      accounts,
      status,
      editing
    }
  }
}

/**
 * This action attempts to connect to the network, gets accounts, and gets the
 * tessera party keys if a url is provided. It then updates the current
 * network whether or not there were errors. If there were errors, it shows
 * them. It also resets transaction results in the deployed contract widgets
 * after connection to prevent confusion when switching nodes.
 *
 * @param endpoint Geth RPC Url (http://localhost:22000)
 * @param tesseraEndpoint Tessera endpoint (http://localhost:9081)
 * @returns thunk middleware dispatch function
 */
export function connectToNetwork (endpoint, tesseraEndpoint) {
  return async dispatch => {
    dispatch({ type: 'SET_NETWORK_CONNECTING' })
    let accounts = [], status = 'Disconnected', editing = true, error = ''
    try {
      if (endpoint) {
        await updateWeb3Url(endpoint, tesseraEndpoint)
        status = 'Connected'
        editing = false
        accounts = await getAccounts()
        if (tesseraEndpoint !== '') {
          const parties = await getTesseraParties()
          dispatch(setTesseraParties(parties))
          const keys = await getTesseraKeys()
          dispatch(setTesseraKeys(keys))
        } else {
          dispatch(setTesseraParties([]))
          dispatch(setTesseraKeys([]))
        }
      } else {
        error = 'Please connect to a quorum node'
      }

    } catch (e) {
      console.log('Error fetching network data', e.message)
      error = e.message
    }

    dispatch(setError(error))

    dispatch(setNetwork(endpoint, tesseraEndpoint, accounts, status, editing))

    dispatch(resetTransactionResults())
  }
}

/**
 * This action attempts to connect to the given network, connecting if
 * successful and showing an error if unsuccessful.
 *
 * @param endpoint Geth RPC Url (http://localhost:22000)
 * @param tesseraEndpoint Tessera endpoint (http://localhost:9081)
 * @returns thunk middleware dispatch function
 */
export function saveNetwork (endpoint = '', tesseraEndpoint = '') {
  return async dispatch => {
    try {

      if (tesseraEndpoint.endsWith('/')) {
        tesseraEndpoint = tesseraEndpoint.substring(0,
          tesseraEndpoint.length - 1)
      }

      // helper to automatically find partyinfo endpoint when adding a known local node
      if(endpoint.startsWith('http://localhost:2200')) {
        tesseraEndpoint = await getLocalPartyInfoIfAvailable(endpoint)
      }

      await updateTesseraUrl(endpoint, tesseraEndpoint)
      dispatch(connectToNetwork(endpoint, tesseraEndpoint))

    } catch (e) {
      console.log('Error fetching network data', e.message)
      dispatch(setError(e.message))
    }
  }
}

async function getLocalPartyInfoIfAvailable (endpoint) {
  try {
    const {port} = new URL(endpoint)
    // 7nodes default urls are localhost:2200X and localhost:900(X+1)
    const lastDigitIncremented = (port % 10) + 1
    const likelyTesseraEndpoint = `http://localhost:908${lastDigitIncremented}`
    await updateTesseraUrl(endpoint, likelyTesseraEndpoint)
    console.log("Using known quorum-examples partyinfo endpoint found at", likelyTesseraEndpoint)
    return likelyTesseraEndpoint
  } catch (e) {
    return ''
  }
}
