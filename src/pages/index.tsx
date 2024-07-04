import { HomerConatienr, Product } from "../styles/pages/home";
import Image from 'next/image'
import { useKeenSlider } from 'keen-slider/react'
import 'keen-slider/keen-slider.min.css';
import { GetServerSideProps, GetStaticProps } from "next";
import { stripe } from "../lib/stripe";
import { Stripe } from "stripe";
import Link from "next/link";

interface HomeProps {
  products: {
    id: string,
    name: string,
    imageUrl: string,
    totalPrice: number
  }[]
}

export default function Home({ products }: HomeProps) {

  const [sliderRef] = useKeenSlider({
    slides: {
      perView: 3,
      spacing: 48,
    }
  })
  return (
    <HomerConatienr ref={sliderRef} className="keen-slider">

      {
        products.map(product => {
          return (
            <Link href={`/product/${product.id}`}
              key={product.id}  prefetch={false}>

              <Product
                className="keen-slider__slide">
                <Image src={product.imageUrl} width={520} height={480} alt="" />
                <footer>
                  <strong>{product.name}</strong>
                  <span>{product.totalPrice}</span>
                </footer>
              </Product>
            </Link>
          )
        })
      }

    </HomerConatienr>
  )
}

export const getStaticProps: GetStaticProps = async () => {

  const response = await stripe.products.list({
    expand: ['data.default_price']
  })

  const products = response.data.map(product => {
    const totalPrice = product.default_price as Stripe.Price

    return {
      id: product.id,
      name: product.name,
      imageUrl: product.images[0],
      totalPrice: new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(totalPrice.unit_amount as number / 100)


    }
  })

  console.log(response.data);

  return {
    props: {
      products
    },
    revalidate: 60 * 60 * 2,
  }
}
