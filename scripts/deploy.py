from scripts.helpful_scripts import get_account, get_contract
from brownie import DappToken, TokenFarm, network, config
from web3 import Web3
import yaml
import json
import os
import shutil

KEPT_BALANCE = Web3.toWei(100, "ether")


def deploy_token_farm_and_dapp_token(update_front=False):
    account = get_account()
    dapp_token = DappToken.deploy({"from": account})
    token_farm = TokenFarm.deploy(
        dapp_token.address,
        {"from": account},
        publish_source=config["networks"][network.show_active()]["verify"],
    )
    tx = dapp_token.transfer(
        token_farm.address, dapp_token.totalSupply() - KEPT_BALANCE, {"from": account}
    )
    tx.wait(1)
    # dapp_token, weth_token, fau_token/dai
    weth_token = get_contract("weth_token")
    faucet_token = get_contract("fau_token")
    dict_of_allowed_tokens = {
        dapp_token: get_contract("dai_usd_price_feed"),
        faucet_token: get_contract("dai_usd_price_feed"),
        weth_token: get_contract("eth_usd_price_feed"),
    }
    token_farm = add_allowed_tokens(token_farm, dict_of_allowed_tokens, account)
    if update_front:
        update_front_end()
    return token_farm, dapp_token


def add_allowed_tokens(token_farm, dict_of_allowed_tokens, account):
    for token in dict_of_allowed_tokens:
        tx = token_farm.addAllowedToken(token.address, {"from": account})
        tx.wait(1)
        set_tx = token_farm.setPriceFeed(
            token.address, dict_of_allowed_tokens[token], {"from": account}
        )
        set_tx.wait(1)
    return token_farm


def update_front_end():
    copy_folders_to_front("./build", "./front_end/src/chain-info")
    with open("brownie-config.yaml", "r") as file:
        config_dict = yaml.load(file, Loader=yaml.FullLoader)
    with open("./front_end/src/brownie-config.json", "w") as new_file:
        json.dump(config_dict, new_file)
    print("Uploaded config to the frontend")


def copy_folders_to_front(src, dest):
    if os.path.exists(dest):
        shutil.rmtree(dest)
    shutil.copytree(src, dest)


def main():
    deploy_token_farm_and_dapp_token(update_front=True)
