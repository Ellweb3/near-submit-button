import React from 'react'
import 'regenerator-runtime/runtime';
import bs58 from 'bs58'
import { useEffect, useState, useContext } from 'react'
import Swal from 'sweetalert2'
import * as nearAPI from 'near-api-js';
const { providers, utils, keyStores, KeyPair } = nearAPI

import { Button, Text, View, StyleSheet } from 'react-native'


const NearSubmitButton = (props) => {

console.log(props, "subProps");
	const currentUrl = new URL(window.location.href)
	const user = {
		accountId: props.parametr1Value
	}
	const transactionHashes = currentUrl.searchParams.get('transactionHashes') || ''
	// console.log('props', props);
	
	useEffect(() => {
		
		const transactionStatus = async (transactionHashes) => {
			let promise = new Promise((resolve, reject) => {
				setTimeout(() => resolve("get global"), 500)
			  });
			
			  let resultPromise = await promise;
			if (resultPromise) {
				console.log(global.nearConnect, "globalNear", "result", resultPromise);
				const txStatus = await global.nearConnect.near.connection.provider.txStatus(
					bs58.decode(transactionHashes),
					user.accountId
				)
				const result = providers.getTransactionLastResult(await txStatus)
				// console.log('txStatus', await txStatus);
				const tokensBurnt = await txStatus.transaction_outcome.outcome.tokens_burnt
				const nearBurnt = utils.format.formatNearAmount(tokensBurnt)
				console.log("out", await txStatus.transaction_outcome.outcome);
				props.onSub(result,transactionHashes, nearBurnt)
				return result
			}
		}

		async function getTransaction(transactionHashes) {
			console.log("hash", await transactionHashes);
			const status = await transactionStatus(transactionHashes)
			console.log('status', await status)
			if (await status) {
				console.log('action!!');
				props.hashValue.onChange(transactionHashes)
				props.successAction()
			}
		}

		if (transactionHashes) {
			console.log('has hash',);

			getTransaction(transactionHashes)
		}
	}, [])

	const sendContract = async () => {
		// console.log("contr", global.nearConnect.contract[props.contractMethod]);
		function makeParametrsObject() {
			const argObj = {}
			for (let i = 1; i < 6; i++) {
				console.log("for", props, `parametr${i}Name`, props[`parametr${i}Name`], props[`parametr${i}Value`]);
				if ((props[`parametr${i}Name`]) && (props[`parametr${i}Value`])) {
					let argObjName = props[`parametr${i}Name`]
					argObj[argObjName] = props[`parametr${i}Value`]
				}
			}
			console.log(argObj);
			return argObj
		}
		try {
			
			let isSuccess = await global.nearConnect.contract[props.contractMethod](makeParametrsObject());
			console.log('suc'.isSuccess);
			if (isSuccess) {
				console.log("new NFT minted");

				Swal.fire({
					title: 'DONE!',
					text: 'New NFT Minted!',
					icon: 'success',
					confirmButtonText: 'Cool'
				});
			} else {
				props.onSub(false,0,e).then((result) => {
					if (result.isConfirmed) {
						location.reload();
					}
				});
			}
		} catch (e) {
			props.onSub(false,0,e).then((result) => {
				if (result.isConfirmed) {
					location.reload();
				}
			});
			throw e
		} finally {
			location.reload();
			props.successAction()
		}

	}


	return (

		<View>
			<Button
				color={props.backgroundColor}
				title={props.title}
				onPress={sendContract}></Button>
		</View>

	)

}



export default NearSubmitButton
