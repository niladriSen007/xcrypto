import axios from 'axios'
import React, { useEffect, useState } from 'react'
import {server} from "../index.js"
import { Container,HStack, VStack,Image, Heading, Text } from '@chakra-ui/react'
import Loader from './Loader.jsx'
import Error from './Error.jsx'


function Exchanges() {

    const [exchanges,setExchanges] = useState([])
    const [loading,setLoading] = useState(true)
    const [error,setError] = useState(false)

    useEffect(()=>{
        const fetchExchanges = async()=>{
            try {
                const {data} = await axios.get(`${server}/exchanges`)
                setExchanges(data)
                setLoading(false)
            } catch (e) {
                setLoading(false)
                setError(true)
            }
        }
        fetchExchanges()
    },[])

    if(error) 
        return(<Error message="Error while fetching API"/>)

  return (
    <Container maxW={"container.xl"} >
       {
        loading ? <Loader /> : <> 
        <HStack wrap={"wrap"} justifyContent={"space-evenly"}>
        {
            exchanges.map(exchange=> <ExchangeCard name={exchange.name} key={exchange.id} url={exchange.url} img={exchange.image} rank={exchange.trust_score_rank} />)
        }
        </HStack>
            </>
       }
    </Container>
  )
}

const ExchangeCard = ({name,id,img,rank,url}) =>(
<a href={url} target="blank" >
    <VStack w={"52"} shadow={"lg"} p={"8"} borderRadius={"lg"} transition={"all .3s"} m={"4"} css={{"&:hover":{
        transform:"scale(1.1)"
    }}}>
        <Image src={img} w={"10"} h={"10"} objectFit={"contain"} alt={"exchange"} />
        <Heading size={"md"} noOfLines={1}>{rank}</Heading>
        <Text noOfLines={1}>{name}</Text>
    </VStack>
</a>
)   

export default Exchanges
