import { Badge, Box, Button, Container, HStack, Image, Progress, Radio, RadioGroup, Stat, StatArrow, StatHelpText, StatLabel, StatNumber, Text, VStack } from '@chakra-ui/react'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { server } from '..'
import Chart from './Chart'
import Error from './Error'
import Loader from './Loader'

function CoinDetails() {
  const [coin,setCoin] = useState({

  })
    const [loading,setLoading] = useState(true)
    const [page,setPage] = useState(1)
    const [currency,setCurrency] = useState("inr")
    const [error,setError] = useState(false)
    const [days,setDays] = useState("24h")
    const [chartArray,setChartArray] = useState([])


    const params = useParams()
    const currencySymbol = currency==="inr" ? "₹" : currency === "usd" ? "€"  :"$"


    const btns=["24h","7d","14d","30d","60d","200d"]


    const switchChartStats = (elem) =>{
        switch(elem)
        {
          case "24h":
            setDays("24h")
            break;
            case "7d":
              setDays("7d")
            break;
            case "14d":
              setDays("14d")
            break;
            case "30d":
              setDays("30d")
            break;
            case "60d":
              setDays("60d")
            break;
            case "200d":
              setDays("200d")
            break;
          default:
            setDays("365d")
            break;
        }
    } 

    useEffect(()=>{
      const fetchcoin = async()=>{
          try {
              const {data} = await axios.get(`${server}/coins/${params.id}`)
              const {data:chartData} = await axios.get(`${server}/coins/${params.id}/market_chart?vs_currency=${currency}&days=${days}`)
              setCoin(data)
              // console.log(data)
              setChartArray(chartData.prices)
              setLoading(false)
          } catch (e) {
            console.log(e)
              setLoading(false)
              setError(true)
          }
      }
      fetchcoin()
  },[params.id,currency,days])

  if(error) 
  {   
      
      return(<Error message="Error while fetching Coins"/>)
  }

  return (
    <Container  justifyContent="center">
      {
        loading ? <Loader /> :
        <>
        <Box borderWidth={"1"} w={"full"} marginTop="10">
          <Chart arr={chartArray} currency={currencySymbol} days={days}/>
        </Box>

       
       <HStack p="2" margin={"6"} overflowX="auto">
        {
          btns.map(btn=>(
            <Button key={btn} onClick={()=>switchChartStats(btn)}>{btn}</Button>
          ))
        }
       </HStack>




        <RadioGroup w={"full"} value={currency} onChange={setCurrency} p={"8"}>
        <HStack spacing={"4"} w="full"  justifyContent="center">
            <Radio value={"inr"}>INR</Radio> 
            <Radio value={"usd"}>USD</Radio> 
            <Radio value={"eur"}>EUR</Radio> 
        </HStack>
    </RadioGroup>


    <VStack spacing={"4"}  alignItems={"center"} alignSelf={"center"} justifyContent="center" opacity={0.7}>
      <Text fontSize={"small"} >Last Updated on {Date(coin.market_data.last_updated).split("G")[0]}</Text>
      <Image src={coin.image.large} w={"16"} h={"16"} objectFit={"contain"}/>
      <Stat>
        <StatLabel>{coin.name}</StatLabel>
        <StatNumber>{currencySymbol} {coin.market_data.current_price[currency]}</StatNumber>
        <StatHelpText>
          <StatArrow type={coin.market_data.price_change_percentage_24h > 0 ? "increase" :"decrease" }/>
          {coin.market_data.price_change_percentage_24h}%
        </StatHelpText>
      </Stat>
      <Badge fontSize={"2xl"} bgColor={"blackAlpha.900"} color={"white"}>#{coin.market_cap_rank}</Badge>
      <CustomBar  high={`${currencySymbol} ${coin.market_data.high_24h[currency]}`} low={`${currencySymbol} ${coin.market_data.low_24h[currency]}`}/>

      <Box w={"full"} >
          <Item title={"Max Supply"} value={coin.market_data.max_supply}/>
          <Item title={"Circulating Supply"} value={coin.market_data.circulating_supply}/>
          <Item title={"Market Cap"} value={`${currencySymbol}${coin.market_data.market_cap[currency]}`}/>
          <Item title={"All Time Low"} value={`${currencySymbol}${coin.market_data.atl[currency]}`}/>
          <Item title={"All Time High"} value={`${currencySymbol}${coin.market_data.ath[currency]}`}/>
      </Box>
    </VStack>

    </>
      }
    </Container>
  )
}

const CustomBar = ({high,low}) =>{
 return(
  <VStack>
  <Progress value={50} colorScheme={"teal"} w={"full"}/>
  <HStack justifyContent={"space-between"} w={"full"}>
      <Badge children={low} colorScheme={"red"}/>
      <Text fontSize={"sm"}>24 Hr Range</Text>
      <Badge children={high} colorScheme={"green"}/>
  </HStack>
</VStack>
 )
}

const Item = ({title,value}) =>(
  <HStack justifyContent={"space-between"} w={"full"} my={"4"}>
    <Text fontFamily={"Bebas Neue"} letterSpacing="widest">{title}</Text>
    <Text>{value}</Text>
  </HStack>
)

export default CoinDetails