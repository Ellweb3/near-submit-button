import React from 'react'
import 'regenerator-runtime/runtime';
import { Button, Text, View, StyleSheet } from 'react-native'

const ViewMethod = (props) => {
	const { title, viewMethodName, collection, backgroundColor, onView } = props

	async function viewFunc() {

		 const viewFunctionCollection =  await global.nearConnect.walletConnection.account().functionCall({
			contractId: await global.nearConnect.contract.contractId,
			methodName: viewMethodName,
			args: contractArguments(),
}) 

		compareCollection(viewFunctionCollection, collection)

		const contractArguments = ()=> {
			const argObj = {}
			for (let i = 1; i < 5; i++) {
				if ((props[`parametr${i}Name`]) && (props[`parametr${i}Value`])) {
					let argObjName = props[`parametr${i}Name`]
					argObj[argObjName] = props[`parametr${i}Value`]
				}
			}
			console.log(argObj);
			return argObj
		}
		function compareCollection(contractCollection, userCollection) {
			const foundItems = []
			for (let j = 0; j < contractCollection.length; j++) {
				let isFound = false
				for (let i = 0; i < userCollection.length; i++) {
					let contractItemNumber = Number(contractCollection[j].id)
					let collectionItemNumber = Number(userCollection[i].compareId)
					if (contractItemNumber === collectionItemNumber) {
						isFound = true
					}
				}
				if (!isFound) {
					// console.log("item", contractCollection[j]);
					foundItems.push(contractCollection[j])
				}
			}
			if (foundItems && onView) {
				foundItems.map((item) => {
					onView(item.id, item.metadata.title, item.metadata.media)
					// it can be set to add new parametrs in manifest
				})
			}
		}
	}

	return (
		<View>
			<Button
				color={backgroundColor}
				title={title}
				onPress={() => viewFunc()}></Button>
		</View>
	)

}

export default ViewMethod