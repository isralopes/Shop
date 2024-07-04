import { ImageContainer, ProductContainer, ProductDetails } from "@/src/styles/pages/products"
import { GetServerSideProps, GetStaticPaths, GetStaticProps } from "next"
import { stripe } from "../../lib/stripe"
import Stripe from "stripe"
import Image from 'next/image'
import axios from "axios"
import { useState } from "react"



interface ProductProps {
    product: {
      id: string,
      name: string,
      imageUrl: string,
      totalPrice: string,
      description: string,
      defaultPriceId: string
    }
  }
  

export default function Product ({ product }: ProductProps ) {

  const [isChceoutSession,setIsChceoutSession] = useState(false)

async function buyproduct() {
  try {

    setIsChceoutSession(true)
    const response = await axios.post('/api/checkout' , {
      priceId: product.defaultPriceId
    })

   
    const { checkoutUrl } = response.data

    window.location.href  = checkoutUrl
  } catch (error){
    setIsChceoutSession(false)
   alert('falha ao ir para o checkout')
  }
}   
    return (
     <ProductContainer>
        
        <ImageContainer>
            <Image src={product.imageUrl} width={520} height={480} alt=""  />
        </ImageContainer>
        <ProductDetails>
            <h1>{product.name}</h1>
            <span>{product.totalPrice}</span>
            <p>{product.description}</p>
       <button disabled={isChceoutSession} onClick={buyproduct}>
        Comprar agora
       </button>
        </ProductDetails>
     </ProductContainer>
    )
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking'
  }
}

export const getStaticProps: GetStaticProps<any, { id: string }> = async ({ params }) => {

    if (!params) {
        return {
          notFound: true, 
        };
      }

    const productId = params.id;
  
    const product = await stripe.products.retrieve(productId, {
        expand: ['default_price'],
    });

    const totalPrice = product.default_price as Stripe.Price

    return {
      props: {
        product: {
            id: product.id,
            name: product.name,
            imageUrl: product.images[0],
            totalPrice: new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            }).format(totalPrice.unit_amount as number / 100),
            description: product.description,
            defaultPriceId: totalPrice.id
        }
      
      },
      revalidate: 60 * 60 * 1,
    }
  }