import { errorReducer } from './error'
import { networkReducer } from './network'
import { txMetadataReducer } from './txMetadata'
import { compilationReducer } from './compilation'
import { tesseraReducer } from './tessera'
import { deployedReducer } from './deployed'
import { combineReducers } from 'redux'

export const rootReducer = combineReducers({
    error: errorReducer,
    network: networkReducer,
    txMetadata: txMetadataReducer,
    compilation: compilationReducer,
    tessera: tesseraReducer,
    deployed: deployedReducer,
  })

