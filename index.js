const web3 = require('@solana/web3.js')
const splToken = require('@solana/spl-token')

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

  // create new token mint
  const mint = await splToken.Token.createMint(
    connection,
    fromWallet,
    fromWallet.publicKey,
    null,
    9,
    splToken.TOKEN_PROGRAM_ID
  )

  // get the token amount of the fromWallet solana address, if it does not exist, create it
  const fromTokenAccount = await mint.getOrCreateAssociatedAccountInfo(
    fromWallet.publicKey
  )

  // generate a new wallet to receive newly minted token
  const toWallet = web3.Keypair.generate()

  // get the token account of the toWallet solana address, if it does not exist, create it
  const toTokenAccount = await mint.getOrCreateAssociatedAccountInfo(
    toWallet.publicKey
  )

  // minting a new token to the fromTokenAccount we just returned / created
  await mint.mintTo(
    fromTokenAccount.address, // who it goes to
    fromWallet.publicKey,     // minting authority
    [],                       // multisig
    1000000000                // how many
  )

  await mint.setAuthority(
    mint.publicKey,
    null,
    "MintTokens",
    fromWallet.publicKey,
    []
  )

  // add token transfer instructions to transaction
  const transaction = new web3.Transaction().add(
    splToken.Token.createTransferInstruction(
      splToken.TOKEN_PROGRAM_ID,
      fromTokenAccount.address,
      toTokenAccount.address,
      fromWallet.publicKey,
      [],
      1
    )
  )

  // sign transaction, broardcast, and confirm
  const signature = await web3.sendAndConfirmTransaction(
    connection,
    transaction,
    [fromWallet],
    {commitment: 'confirmed'}
  )

  console.log(signature)
}

main()