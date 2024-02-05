import type { Schema } from 'borsh';
import { serialize } from 'borsh';
import { Button, useToast } from '@chakra-ui/react'
import { useWeb3ModalAccount, useWeb3ModalProvider } from '@web3modal/solana/react'

class Person {
  name: string;
  wallet: string;

  constructor({ name, wallet }: { name: string, wallet: string }) {
    this.name = name;
    this.wallet = wallet;
  }
}

class Mail {
  from: Person;
  to: Person;
  contents: string;

  constructor({ from, to, contents }: { from: Person, to: Person, contents: string }) {
    this.from = from;
    this.to = to;
    this.contents = contents;
  }
}

// Define the schema for Borsh serialization
const schema: Schema = new Map<any, any>([
  [Person, { kind: 'struct', fields: [['name', 'string'], ['wallet', 'string']] }],
  [Mail, { kind: 'struct', fields: [['from', Person], ['to', Person], ['contents', 'string']] }]
]);

const message = new Mail({
  from: new Person({
    name: 'Cow',
    wallet: '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826'
  }),
  to: new Person({
    name: 'Bob',
    wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB'
  }),
  contents: 'Hello, Bob!'
});

export function SolanaSignTypedDataTest() {
  const toast = useToast()
  const { address } = useWeb3ModalAccount()
  const { walletProvider } = useWeb3ModalProvider()

  async function onSignTypedData() {
    try {
      if (!walletProvider || !address) {
        throw Error('user is disconnected')
      }
      console.log(`walletProvider`, walletProvider);
      // Serialize the data
      const serializedData = serialize(schema, message);
      // Sign the serialized data
      console.log(`serializedData`, serializedData);
      const signature = await walletProvider.request({
        method: "signMessage",
        params: {
          message: serializedData,
          display: "hex",
        },
      });
      // const signature = await walletProvider.signMessage(serializedData);

      toast({ title: 'Succcess', description: signature, status: 'success', isClosable: true })
    } catch (err) {
      console.log(`err`, err);
      toast({
        title: 'Error',
        description: 'Failed to sign message',
        status: 'error',
        isClosable: true
      })
    }
  }

  return (
    <Button data-testid="sign-typed-data-button" onClick={onSignTypedData}>
      Sign Typed Data
    </Button>
  )
}