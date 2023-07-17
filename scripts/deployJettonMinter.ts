import { Address, beginCell, toNano } from 'ton-core';
import { JettonMinter } from '../wrappers/JettonMinter';
import { compile, NetworkProvider } from '@ton-community/blueprint';
import { JettonWallet } from 'ton';

export async function run(provider: NetworkProvider, args: string[]) {

    const randomSeed = Math.floor(Math.random() * 10000);

    const jettonMinter = provider.open(JettonMinter.createFromConfig({
        
        adminAddress: provider.sender().address as Address,
        content: JettonMinter.buildOnchainMetadata({
            "image": "https://hotpotdao.xyz/logo.png",
            "symbol": "HPT",
            "name": "Hotpot Token",
            "description": "This is A Hotpot Test Token",
         }),
        jettonWalletCode: await compile('JettonWallet')

    }, await compile('JettonMinter')));

    await jettonMinter.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(jettonMinter.address);
    console.log('deployed')
    await jettonMinter.sendMint(provider.sender(), {
        value: toNano('0.05'),
        amount: toNano('0.05'),
        jettonAmount: toNano('300'),
        toAddress: provider.sender().address as Address,
        queryId: Date.now()
    });

    console.log('mined')
    const ui = provider.ui();
    const addr = Address.parse(args.length > 0 ? args[0] : await ui.input('user address'));
    console.log(addr)
    const jettonWallet = provider.open(JettonWallet.create(addr))
    let bal = await jettonWallet.getBalance()
    console.log(bal)
}
