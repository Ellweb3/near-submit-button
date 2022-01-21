import React from 'react'
import 'regenerator-runtime/runtime';
import { Button, Text, View, StyleSheet } from 'react-native'

const ViewMethod = (props) => {
	const { title, viewMethodName, collection, backgroundColor, onView } = props

	async function viewFunc() {
		const viewFunctionCollection = await global.nearConnect.contract[viewMethodName](makeParametrsObject())
		compareCollection(viewFunctionCollection, collection)

		function makeParametrsObject() {
			const argObj = {}
			for (let i = 1; i < 4; i++) {
				if ((props[`parametr${i}Name`]) && (props[`parametr${i}Value`])) {
					let argObjName = props[`parametr${i}Name`]
					argObj[argObjName] = props[`parametr${i}Value`]
				}
			}
			// console.log(argObj);
			return argObj
		}
		function compareCollection(contractCollection, userCollection) {
			const addCollection = []
			for (let j = 0; j < contractCollection.length; j++) {
				let findResult = false
				for (let i = 0; i < userCollection.length; i++) {
					let contractItemNumber = Number(contractCollection[j].id)
					let collectionItemNumber = Number(userCollection[i].compareId)
					if (contractItemNumber === collectionItemNumber) {
						findResult = true
					}
				}
				if (!findResult) {
					// console.log("item", contractCollection[j]);
					addCollection.push(contractCollection[j])
				}
			}
			if (addCollection) {
				addCollection.map((item) => {
					onView(item.id, item.metadata.title, item.metadata.media)
					// console.log(item.id, item.metadata.title, item.metadata.media);
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
