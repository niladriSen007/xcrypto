import axios from 'axios'
import React, { useEffect, useState } from 'react'
import {server} from "../index.js"
import { Container,HStack, VStack,Image, Heading, Text, Button, RadioGroup, Radio } from '@chakra-ui/react'
import Loader from './Loader.jsx'
import Error from './Error.jsx'
import CoinCard from './CoinCard.jsx'


function Coins() {

    const [coins,setCoins] = useState([])
    const [loading,setLoading] = useState(true)
    const [page,setPage] = useState(1)
    const [currency,setCurrency] = useState("inr")
    const [error,setError] = useState(false)

    const currencySymbol = currency==="inr" ? "₹" : currency === "usd" ? "€"  :"$"

    const changePage = p =>{
        setPage(p)
        setLoading(true)
    }

    const pageButtons = new Array(132).fill(1)

    useEffect(()=>{
        const fetchcoins = async()=>{
            try {
                const {data} = await axios.get(`${server}/coins/markets?vs_currency=${currency}&page=${page}`)
                setCoins(data)
                setLoading(false)
            } catch (e) {
                setLoading(false)
                setError(true)
            }
        }
        fetchcoins()
    },[currency,page])

    if(error) 
    {
        console.log(Error)
        return(<Error message="Error while fetching Coins"/>)
    }
  return (
    <Container maxW={"container.xl"} >
       {
        loading ? <Loader /> : <> 

{/* "₹" : currency === "usd" ? "€"  :"$" */}
        <RadioGroup value={currency} onChange={setCurrency} p={"8"}>
            <HStack spacing={"4"}>
                <Radio value={"inr"}>INR</Radio> 
                <Radio value={"usd"}>USD</Radio> 
                <Radio value={"eur"}>EUR</Radio> 
            </HStack>
        </RadioGroup>

        <HStack wrap={"wrap"} justifyContent="space-evenly">
        {
            coins.map(coin=> <CoinCard id={coin.id} name={coin.name} key={coin.id}  img={coin.image} price={coin.current_price} symbol={coin.symbol} currencySymbol={currencySymbol} />)
        }
        </HStack>
        <HStack w={"full"} overflowX={"auto"} p={"8"}>
          {
            pageButtons.map((btn,index)=>(
                <Button key={index} bgColor={"blackAlpha.900"} color={"white"} onClick={()=>changePage(index+1)}>{index+1}</Button>
            ))
          }
        </HStack>
            </>
       }
    </Container>
  )
}

 

export default Coins
