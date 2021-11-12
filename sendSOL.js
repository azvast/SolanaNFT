const web3 = require('@solana/web3.js')

async function main() {
  // connect to cluster
  const connection = new web3.Connection(
    web3.clusterApiUrl('devnet'),
    'confirmed'
  )

  // generate a new wallet keypair
  const fromWallet = web3.Keypair.generate()

  // airdrop 1 SOL
  const fromAirdropSignature = await connection.requestAirdrop(
    fromWallet.publicKey,
    web3.LAMPORTS_PER_SOL
  )

  // wait for airdrop confirmation
  await connection.confirmTransaction(fromAirdropSignature)

  // generate a new wallet to receive SOL
  const toWallet = web3.Keypair.generate()

  // create a new transaction object and then send SOL
  const transaction = new web3.Transaction().add(
    web3.SystemProgram.transfer({
      fromPubkey: fromWallet.publicKey,
      toPubkey: toWallet.publicKey,
      lamports: web3.LAMPORTS_PER_SOL / 100
    })
  )

  // sign transaction, broadcase, and confirm
  const signature = await web3.sendAndConfirmTransaction(
    connection,
    transaction,
    [fromWallet]
  )
  
  console.log(signature)
}

main()