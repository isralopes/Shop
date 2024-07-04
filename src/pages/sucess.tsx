import Link from "next/link";
import { ImageContainer } from "../styles/pages/products";
import { SucessContainer } from "../styles/pages/sucess";

export default function Sucess () {
    return (
      <SucessContainer>

        <h1>Compra Efetuada</h1>
        <ImageContainer>

        </ImageContainer>
        <p>
            Test <strong>
                Isra Lopes
            </strong>, sua <strong>
                 Camiseta sem limites</strong> Ja esta a Caminho
        </p>

        <Link href="/">
            Voltar ao catalogo 
        </Link>
      </SucessContainer>
    )
}