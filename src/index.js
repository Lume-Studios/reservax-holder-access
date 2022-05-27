import axios from 'axios';
import ABI from './contract/ABI.json'

const web3 = new Web3(Web3.givenProvider);

const contract = new web3.eth.Contract(ABI, process.env.CONTRACT_ADDRESS);

const connectButton = document.querySelector('.connect-button')
const errorWrapper = document.querySelector('.error-wrapper')
const errorMessage = document.querySelector('.error-message')
const loadingWrapper = document.querySelector('.loading-wrapper')

const prepareError = () => {
    errorWrapper.classList.remove('active-error')
    errorWrapper.classList.add('is-hidden')
}

const setError = (message) => {
    if (message !== '') {
        errorMessage.innerText = message
    }
    errorWrapper.classList.remove('is-hidden')
    errorWrapper.classList.add('active-error')
}

const setLoadingForConnect = () => {
    loadingWrapper.classList.remove('is-hidden')
    errorWrapper.classList.remove('active-error')
    errorWrapper.classList.add('is-hidden')
    connectButton.classList.add('is-hidden')
}

const openseaLink = document.createElement('a')
openseaLink.href = 'https://opensea.io/collection/reservax'
openseaLink.title = 'OpenSea'

const isHolder = async () => {
    prepareError()
    setLoadingForConnect()
    try {
        const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
        });
        console.log(accounts[0])
        let balanceTotal = 0

        if (accounts.length > 0) {
            const array = [0, 1, 2, 3, 4, 5]
            for (let index of array) {
                const balance = await contract.methods.balanceOf(accounts[0], index).call()
                console.log(balance)
                balanceTotal += Number(balance)
            }


            if (balanceTotal) {
                const message = process.env.AUTHENTICATION;
                const signature = await ethereum.request({ method: 'personal_sign', params: [message, accounts[0]] });
                const response = await axios.post(process.env.SERVER + 'auth/login', {
                    address: accounts[0],
                    projectId: process.env.PROJECT_ID,
                    hash: signature
                })
                if (response) {
                    localStorage.setItem('ACCESS_TOKEN', response.data.token)
                    axios.defaults.headers.common.authentication = response.data.token
                    window.location.assign('/lounge')
                }

            }
            else window.location.assign('/not-holder')
        }
    }
    catch (err) {
        if (err.message) {
            setError(err.message)
        }
        loadingWrapper.classList.add('is-hidden')
        connectButton.classList.remove('is-hidden')
        console.log(err.response.data)
        setError(err.response.data)
    }
}

connectButton.addEventListener('click', isHolder)

// verifica se o usuário tem o metamask instalado
if (!window.ethereum) {
    connectButton.innerText = 'Por favor instale o metamask!'
    connectButton.classList.add('is-disabled')
}


ethereum.on('chainChanged', handleChainChanged);

function handleChainChanged(_chainId) {
    if (_chainId !== process.env.CHAIN_ID) {
        connectButton.innerText = 'Por favor conecte-se a Mainnet'
        connectButton.classList.add('is-disabled')
        connectButton.style.whiteSpace = 'nowrap'
        connectButton.style.width = '70%'
    } else {
        window.location.reload();
    }

}

