'use strict'

import { existsSync, readFileSync } from 'fs'
import { resolve, join } from 'path'
import { Gateway, Wallets } from 'fabric-network'
import FabricCAServices from 'fabric-ca-client'

/**
 * @param {*} FabricCAServices
 * @param {*} ccp
 */

const adminID = "admin"
const adminPWD = "adminpw"

// create a new CA client for interacting with the CA
function buildCAClient(FabricCAServices, ccp, caHostName){
	const caInfo = ccp.certificateAuthorities[caHostName]		//lookup CA details from config
	const caTLSCACerts = caInfo.tlsCACerts.pem
	const caClient = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName)

	console.log(`built a CA client named ${caInfo.caName}`)
	return caClient
}

async function enrollAdmin(caClient, wallet, orgMspId){
	try{
		const identity = await wallet.get(adminID)			// check to see if user is aleady enrolled
		if(identity){
			console.log(`an identity for the admin user already exists in the wallet`)
			return
		}

		const enrollment = await caClient.enroll({ 
            enrollmentID: adminID, 
            enrollmentSecret: adminPWD
        })		// enroll the admin user, and import the new identity into the wallet
		const x509Identity = {
			credentials: {
				certificate: enrollment.certificate,
				privateKey: enrollment.key.toBytes(),
			},
			mspId: orgMspId,
			type: 'X.509',
		}
		await wallet.put(adminID, x509Identity)
		console.log(`successfully enrolled admin and imported it into the wallet`)
	}
	catch(error){
		console.error(`<enrollAdmin> failed to enroll admin user : ${error}`)
	}
}

// userID is simple name of the patient
async function registerAndEnrollUser(caClient, wallet, orgMspId, userId, affiliation){
	try{
		const userIdentity = await wallet.get(userId)		// check to see if user is aleady enrolled
		if(userIdentity){
			console.log(`an identity for the user ${userId} already exists in the wallet`)
			return
		}

		const adminIdentity = await wallet.get(adminID)	// must use an admin to register a new user
		if(!adminIdentity){
			console.log(`an identity for the admin user does not exist in the wallet`)
			console.log(`enroll the admin user before retrying`)
			return
		}

		const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type)		// build a user object for authenticating with the CA
		const adminUser = await provider.getUserContext(adminIdentity, adminID)

		const secret = await caClient.register({		// register the user, enroll the user, and import the new identity into the wallet
			affiliation: affiliation,					// if affiliation is specified by client, the affiliation value must be configured in CA
			enrollmentID: userId,
			role: 'client',
            attrs: [{"name":"ClientID", "value":"patient_" + userId + "_" + orgMspId}]       // set attribute
		}, adminUser)
		const enrollment = await caClient.enroll({
			enrollmentID: userId,
			enrollmentSecret: secret,
            attr_reqs: [{name:"ClientID", optional: false}]     // make attribute mandatory
		})
		const x509Identity = {
			credentials: {
				certificate: enrollment.certificate,
				privateKey: enrollment.key.toBytes(),
			},
			mspId: orgMspId,
			type: 'X.509',
		}
		await wallet.put(userId, x509Identity)
		console.log(`successfully registered and enrolled user ${userId} and imported it into the wallet`)
	}
	catch(error){
		console.error(`<registerAndEnrollUser> failed to register user : ${error}`)
	}
}

function buildCCP(org){
	const ccpPath = resolve("../../", "test-network", "organizations", "peerOrganizations", org+".example.com", "connection-"+org+".json")		// load the common connection configuration file
	const fileExists = existsSync(ccpPath)
	if(! fileExists){
		throw new Error(`<buildCCP> no such file or directory: ${ccpPath}`)
	}
	const contents = readFileSync(ccpPath, 'utf-8')

	const ccp = JSON.parse(contents)		// build a JSON object from the file contents

	console.log(`loaded the network configuration located at ${ccpPath}`)
	return ccp
}

async function buildWallet(Wallets, walletPath){
	let wallet		// create a new  wallet for managing identities
	if(walletPath){
		wallet = await Wallets.newFileSystemWallet(walletPath)
		console.log(`built a file system wallet at ${walletPath}`)
	}
	else{
		wallet = await Wallets.newInMemoryWallet()
		console.log(`built an in memory wallet`)
	}
	return wallet
}

export async function initGateway(org , OrgMSP , userID){
	console.log(`${GREEN}--> Fabric client user & Gateway init: Using ${org} identity to ${org} Peer${RESET}`)
	// build an in memory object with the network configuration (also known as a connection profile)
	const ccp = buildCCP(org)

	// build an instance of the fabric ca services client based on
	// the information in the network configuration
	const caClient = buildCAClient(FabricCAServices, ccp, 'ca.'+org+'.example.com')

	// setup the wallet to cache the credentials of the application user, on the app server locally
	const walletPath = join(process.cwd(), '../config/wallet', org)
	const wallet = await buildWallet(Wallets, walletPath)

	// in a real application this would be done on an administrative flow, and only once
	// stores admin identity in local wallet, if needed
	await enrollAdmin(caClient, wallet, OrgMSP)
	// register & enroll application user with CA, which is used as client identify to make chaincode calls
	// and stores app user identity in local wallet
	// In a real application this would be done only when a new user was required to be added
	// and would be part of an administrative flow
	await registerAndEnrollUser(caClient, wallet, OrgMSP, userID, org+'.department1')

	try{
		// Create a new gateway for connecting to Org's peer node.
		const gateway = new Gateway()
		//connect using Discovery enabled
		await gateway.connect(ccp,
			{ wallet: wallet, identity: userID, discovery: { enabled: true, asLocalhost: true } })

		return gateway
	}
    catch(error){
		console.error(`Error in connecting to gateway for ${org}: ${error}`)
		process.exit(1)
	}
}
