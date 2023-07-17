import { Address, toNano } from 'ton-core';
import { JettonMinter } from '../wrappers/JettonMinter';
import { NetworkProvider, sleep } from '@ton-community/blueprint';
import { JettonWallet } from 'ton';

export async function run(provider: NetworkProvider, args: string[]) {
    const ui = provider.ui();

    // const address = Address.parse(args.length > 0 ? args[0] : await ui.input('Minter address'));
    const ctt = Address.parse("EQAWEpYvmnKyOLegB6JSj1km-dA09ubrIz_31y-nOSuiCUqM")
    const jettonMinter = provider.open(JettonMinter.createFromAddress(ctt));

    await jettonMinter.sendMint(provider.sender(), {
        value: toNano('0.05'),
        amount: toNano('0.05'),
        jettonAmount: toNano('300'),
        toAddress: provider.sender().address as Address,
        queryId: Date.now()
    });
    
    ui.write('Minted successfully!');
}