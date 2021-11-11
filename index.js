const web3 = require('@solana/web3.js')
const splToken = require('@solana/spl-token')

async function main() {
  // connect to cluster
  const connection = new web3.Connection(
    web3.clusterApiUrl('devnet'),
    'confirmed'
  )

  
}

main()