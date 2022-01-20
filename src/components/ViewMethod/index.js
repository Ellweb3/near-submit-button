import React from 'react'
import 'regenerator-runtime/runtime';
import { useEffect, useState, } from 'react'
import Swal from 'sweetalert2'
import * as nearAPI from 'near-api-js';
import { Button, Text, View, StyleSheet } from 'react-native'
import { ArgumentTypeError } from 'near-api-js/lib/utils/errors';

const ViewMethod = (props) => {
	const { title, viewMethodName, collection, isChange, parametr1Name, parametr2Name, parametr3Name, parametr1Value, parametr2Value, parametr3Value, backgroundColor, onView, netType, contractName, compareId } = props
	// const [nfts, setNfts] = useState([])


	// const viewFunc = 
	async function viewFunc() {
		function makeParametrsObject() {
			const argObj = {}
			for (let i = 1; i < 4; i++) {
				console.log("for", props, `parametr${i}Name`, props[`parametr${i}Name`], props[`parametr${i}Value`]);
				if ((props[`parametr${i}Name`]) && (props[`parametr${i}Value`])) {
					let argObjName = props[`parametr${i}Name`]
					argObj[argObjName] = props[`parametr${i}Value`]
				}
			}
			console.log(argObj);
			return argObj
		}
		console.log("viewmet", global.nearConnect.contract);
		const nftArr = await global.nearConnect.contract[viewMethodName](makeParametrsObject())
		console.log("nftARRR", nftArr);

		for (let j = 0; j < nftArr.length; j++) {
			if (collection.length === 0) {
				console.log(j,"j",collection);
				onView(nftArr[j].id, nftArr[j].metadata.title, nftArr[j].metadata.media)
				console.log(nftArr[j], nftArr[j].metadata.title, nftArr[j].metadata.media);
				let item = {
					compareId: nftArr[j].id
				}
				collection.push(item)
			}
			for (let i = 0; i < collection.length; i++) {
				console.log(i,"i", collection);
				let numNewItem = +nftArr[j].id
				let numItem = +collection[i].compareId
				if (numNewItem !== numItem) {
					console.log("compare", numNewItem, numItem, nftArr[j].id, collection[i].compareId );
					onView(nftArr[j].id, nftArr[j].metadata.title, nftArr[j].metadata.media)
					let item = {
						compareId: nftArr[j].id
					}
				}
			}
		}
		// nftArr.map((newItem) => {
		// 	console.log(newItem, "newItem");
		// 	collection.map((item) => {
		// 		console.log(item, "collectItem");
		// 		let numNewItem = +newItem.id
		// 		let numItem = +item.compareId
		// 		if (numNewItem !== numItem) {
		// 			onView(newItem.id, newItem.metadata.title, newItem.metadata.media)
		// 		}
		// 	})
		// })

		const jsonarr = JSON.stringify(nftArr)
		return true

	}
	// if (nfts) {
	// 	console.log(nfts);

// useEffect(() => {
// 	// if (nfts) {
// 	// 	console.log(nfts);
// 	// }
// }, [])

// useEffect(() => {
// 	if (global.nearConnect) {
// 		console.log("super", global.nearConnect);
// 	}
// }, [])

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
