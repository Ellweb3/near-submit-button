import React from 'react'
import 'regenerator-runtime/runtime';
import bs58 from 'bs58'
import { useEffect, useState } from 'react'
import * as nearAPI from 'near-api-js';
const { providers, utils } = nearAPI
import { Button, Text, View, StyleSheet } from 'react-native'

const NearSubmitButton = (props) => {
	const { onSub, successAction } = props
	const currentUrl = new URL(window.location.href)
	const transactionHashes = currentUrl.searchParams.get('transactionHashes') || ''

	useEffect(() => {

		const transactionStatus = async (transactionHashes) => {
			let promise = new Promise((resolve, reject) => {
				setTimeout(() => resolve("get global object"), 500)
			});
			let resultPromise = await promise;
			if (resultPromise) {
				const txStatus = await global.nearConnect.near.connection.provider.txStatus(
					bs58.decode(transactionHashes),
					global.nearConnect.currentUser.accountId
				)
				const result = await providers.getTransactionLastResult(txStatus)
				const tokensBurnt = await txStatus.transaction_outcome.outcome.tokens_burnt
				const nearBurnt = utils.format.formatNearAmount(tokensBurnt)
				return ({ result, tokensBurnt, nearBurnt, transactionHashes })
			}
		}

		async function getTransaction(transactionHashes) {
			await transactionStatus(transactionHashes).then((res) => {
				onSub(res.result, res.nearBurnt, res.transactionHashes)
				props.hashValue.onChange(res.transactionHashes)
				successAction()
			})

		}

		if (transactionHashes) {
			console.log('has hash',transactionHashes);
			getTransaction(transactionHashes)
		}
	}, [transactionHashes])

	const sendContract = async () => {
		function makeParametrsObject() {
			const argObj = {}
			for (let i = 1; i < 6; i++) {
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
				if (isSuccess) {
					console.log("Success");
				} 
			// else {
			// 		console.log(false,0,e).then((result) => {
			// 			if (result.isConfirmed) {
			// 				// location.reload();
			// 			}
			// 		});
			// 	}
		} catch (e) {
			console.log(false, 0, e).then((result) => {
				if (result.isConfirmed) {
					// location.reload();
				}
			});
			throw e
		} finally {
			// location.reload();
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
