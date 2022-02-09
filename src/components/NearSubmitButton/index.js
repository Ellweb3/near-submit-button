import React from 'react'
import 'regenerator-runtime/runtime';
import bs58 from 'bs58'
import BN from 'bn.js'
import { useEffect } from 'react'
import * as nearAPI from 'near-api-js';
const { providers, utils } = nearAPI
import { Button,View, StyleSheet } from 'react-native'

const NearSubmitButton = (props) => {
	const { onSub, successAction } = props
	const currentUrl = new URL(window.location.href)
	const transactionHashes = currentUrl.searchParams.get('transactionHashes') || ''
	const GAS = new BN('200000000000000')
	const attachedDeposit = utils.format.parseNearAmount(`${props?.deposit}`)

	useEffect(() => {
		const transactionStatus = async (transactionHashes) => {
			let promise = new Promise((resolve, reject) => {
				setTimeout(() => resolve("get global object"), 1000)
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
			 await transactionStatus(transactionHashes).then(async (res) => {
				if (res.result) {
					await onSub(res.result, res.nearBurnt, res.transactionHashes)
					await props.hashValue.onChange(res.transactionHashes)
					successAction()
					window.history.pushState(null, null, window.location.pathname);
				} else {
					await onSub(res.result, res.nearBurnt, res.transactionHashes)
					await props.hashValue.onChange(res.transactionHashes)
					props.errorAction()
				}
			})
		}

		if (transactionHashes) {
			getTransaction(transactionHashes)
		}
	}, [transactionHashes])

	const sendContract = async () => {
		
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
		console.log(contractArguments());

		const callObject = {		
				contractId: await global.nearConnect.contract.contractId,
				methodName: props.contractMethod,
				args: contractArguments(),
				gas: GAS
		}
		if (attachedDeposit) {
			callObject.attachedDeposit = attachedDeposit
		}

		await global.nearConnect.walletConnection.account().functionCall(callObject)
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
