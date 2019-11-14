const initialState = {
  deployedAddresses: [],
  deployedContracts: {},
}

export function deployedReducer (deployed = initialState, action) {
  switch (action.type) {
    case 'ADD_CONTRACT':
      const contract = action.payload
      const newAddresses = [...deployed.deployedAddresses]
      if (newAddresses.indexOf(contract.address) === -1) {
        newAddresses.push(contract.address)
      }
      return {
        ...deployed,
        deployedAddresses: newAddresses,
        deployedContracts: {
          ...deployed.deployedContracts,
          [contract.address]: contract
        }
      }

    case 'REMOVE_CONTRACT':
      const addressToDelete = action.payload
      const newDeployedContracts = { ...deployed.deployedContracts }
      delete newDeployedContracts[addressToDelete]
      return {
        ...deployed,
        deployedAddresses: deployed.deployedAddresses.filter(
          (a) => a !== addressToDelete),
        deployedContracts: newDeployedContracts
      }

    case 'SET_CONTRACT_LOADING':
      const toContract = deployed.deployedContracts[action.payload.address]
      return {
        ...deployed,
        deployedContracts: {
          ...deployed.deployedContracts,
          [action.payload.address]: {
            ...toContract,
            loading: action.payload.loading,
          }
        }
      }

    case 'METHOD_CALL_SUCCESS':
      const { address, methodSignature, result } = action.payload
      const deployedContract = deployed.deployedContracts[address]
      return {
        ...deployed,
        deployedContracts: {
          ...deployed.deployedContracts,
          [address]: {
            ...deployedContract,
            results: {
              ...deployedContract.results,
              [methodSignature]: result,
            }
          }
        }
      }

    case 'RESET_TX_RESULTS':
      const resetDeployedContracts = { ...deployed.deployedContracts }
      deployed.deployedAddresses.forEach(
        (address) => resetDeployedContracts[address].results = {})
      return {
        ...deployed,
        deployedContracts: resetDeployedContracts
      }

    case 'EXPAND_CONTRACT':
      const expandContract = deployed.deployedContracts[action.payload.address]
      return {
        ...deployed,
        deployedContracts: {
          ...deployed.deployedContracts,
          [action.payload.address]: {
            ...expandContract,
            expanded: action.payload.expand,
          }
        }
      }

    default:
      return deployed
  }

}
