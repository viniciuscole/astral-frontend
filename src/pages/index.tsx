import styles from "../styles/pages/Home.module.css";

import api from "@/api/api";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { ProdutoInteface } from "@/types/Produto";

import { Header } from "../components/Header";
import { Button } from "../components/Button";
import { Categoria } from "@/components/Categoria";
import { CardProduto } from "@/components/CardProduto";
import { Footer } from "@/components/Footer";

import { HiOutlineEmojiSad } from "react-icons/hi";

import { Produto } from "@/classes/Produto";
import { Produtor } from "@/classes/Produtor";
import { Carrinho } from "@/classes/Carrinho";
import { ItemCompra } from "@/classes/ItemCompra";

interface nomeInputProps {
  nome: string;
}

export function nomeInput(props: nomeInputProps) {
  const nome = props.nome;
  return nome;
}

enum CategoriaEnum {
  FRUTAS = "FRUTAS",
  LEGUMES = "LEGUMES",
  VERDURAS = "VERDURAS",
  EMBALADOS = "EMBALADOS",
  DOCES = "DOCES",
  GRANJA = "GRANJA",
  OUTROS = "OUTROS",
}

interface CategoriaInterface {
  [key: string]: boolean;
}

export default function Home() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [valorCarrinho, setValorCarrinho] = useState(0);
  const [carrinho, setCarrinho] = useState<Carrinho>(new Carrinho());

  const getProdutos = async () => {
    api
      .get("/produto")
      .then((response) => {
        response.data.forEach((produto: ProdutoInteface) => {
          const produtor = new Produtor(
            produto.produtor.nome,
            produto.produtor.disponivel,
            produto.produtor.telefone,
            produto.produtor.id
          );
          const produtoNovo = new Produto(
            produto.descricao,
            produto.preco,
            produto.medida,
            produtor,
            produto.qtdEstoque,
            produto.categoria,
            produto.imagem,
            produto.id,
            produto.disponivel
          );
          setProdutos((prevState) => [...prevState, produtoNovo]);
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    let carrinho = new Carrinho();
    if (localStorage.getItem("carrinho") === null)
      localStorage.setItem("carrinho", carrinho.toJson());
    else {
      const carrinhoJSON = localStorage.getItem("carrinho");
      if (carrinhoJSON) {
        carrinho = carrinho.fromJSON(carrinhoJSON);
      }
    }
    setValorCarrinho(carrinho.calcularTotal());
    setCarrinho(carrinho);

    getProdutos();
  }, []);

  const [busca, setBusca] = useState("");
  const [vetNomesProdutoresClicados, setVetNomesProdutoresClicados] = useState<
    string[]
  >([]);
  const [categorias, setCategorias] = useState<CategoriaInterface>({
    [CategoriaEnum.FRUTAS]: false,
    [CategoriaEnum.LEGUMES]: false,
    [CategoriaEnum.VERDURAS]: false,
    [CategoriaEnum.EMBALADOS]: false,
    [CategoriaEnum.DOCES]: false,
    [CategoriaEnum.GRANJA]: false,
    [CategoriaEnum.OUTROS]: false,
  });

  let qtdProdutos = 0;

  function toggleCategoriaAtiva(categoria: CategoriaEnum): void {
    setCategorias((prevState) => ({
      ...prevState,
      [categoria]: !prevState[categoria],
    }));
  }

  const categoriasAtivas = Object.entries(categorias)
    .filter(([_, ativa]) => ativa)
    .map(([categoria, _]) => categoria as string);

  const handleSearch = (busca: string) => {
    setBusca(busca);
  };

  const handleFiltroProdutor = (produtores: string[]) => {
    setVetNomesProdutoresClicados(produtores);
  };

  const colocaCarrinho = (item: ItemCompra) => {
    carrinho.adicionarItem(item);
    localStorage.setItem("carrinho", carrinho.toJson());
    setValorCarrinho(carrinho.calcularTotal());
  };

  return (
    <>
      <Header
        retornaBusca={(busca) => handleSearch(busca)}
        retornaProdutoresSelecionados={(vetNomesProdutoresClicados) =>
          handleFiltroProdutor(vetNomesProdutoresClicados)
        }
        valorCarrinho={valorCarrinho}
      />
      <div className={styles.banner}>
        <h1>Feira Astral</h1>
        <p>
          Nos dedicamos a entregar os melhores produtos orgânicos do município
          de Santa Teresa. Venha conhecer!
        </p>
        <a href="/sobre">
          <Button text="SOBRE NÓS" onClick={() => {}} classType="botaoBanner" />
        </a>
      </div>
      <div className={styles.categoriaDiv}>
        <h2>Filtrar por categoria</h2>
        <section className={styles.categorias}>
          <Categoria
            imagem="/frutas.png"
            titulo="Frutas"
            categoriaAtiva={categorias[CategoriaEnum.FRUTAS]}
            onClickfunc={() => toggleCategoriaAtiva(CategoriaEnum.FRUTAS)}
          />
          <Categoria
            imagem="/legumes.png"
            titulo="Legumes"
            categoriaAtiva={categorias[CategoriaEnum.LEGUMES]}
            onClickfunc={() => toggleCategoriaAtiva(CategoriaEnum.LEGUMES)}
          />
          <Categoria
            imagem="/verduras.png"
            titulo="Verduras"
            categoriaAtiva={categorias[CategoriaEnum.VERDURAS]}
            onClickfunc={() => toggleCategoriaAtiva(CategoriaEnum.VERDURAS)}
          />
          <Categoria
            imagem="/embalados.png"
            titulo="Embalados"
            categoriaAtiva={categorias[CategoriaEnum.EMBALADOS]}
            onClickfunc={() => toggleCategoriaAtiva(CategoriaEnum.EMBALADOS)}
          />
          <Categoria
            imagem="/doces-e-frutas.png"
            titulo="Doces"
            categoriaAtiva={categorias[CategoriaEnum.DOCES]}
            onClickfunc={() => toggleCategoriaAtiva(CategoriaEnum.DOCES)}
          />
          <Categoria
            imagem="/granja-e-pescados.png"
            titulo="Granja e Pescados"
            categoriaAtiva={categorias[CategoriaEnum.GRANJA]}
            onClickfunc={() => toggleCategoriaAtiva(CategoriaEnum.GRANJA)}
          />
          <Categoria
            imagem="/outros.png"
            titulo="Outros"
            categoriaAtiva={categorias[CategoriaEnum.OUTROS]}
            onClickfunc={() => toggleCategoriaAtiva(CategoriaEnum.OUTROS)}
          />
        </section>
      </div>
      <div className={styles.produtosDiv}>
        <section className={styles.produtosSection}>
          <h2>Nossos Produtos</h2>
          <section className={styles.produtos}>
            {produtos.map((produto) => {
              if (
                (categoriasAtivas.length === 0 ||
                  categoriasAtivas.includes(produto.categoria)) &&
                (produto.descricao
                  .toLowerCase()
                  .includes(busca.toLowerCase()) ||
                  busca === "") &&
                (vetNomesProdutoresClicados.includes(produto.produtor.nome) ||
                  vetNomesProdutoresClicados.length == 0)
              ) {
                qtdProdutos++;
                return (
                  <CardProduto
                    key={produto.id}
                    produto={produto}
                    retornaItem={(item) => colocaCarrinho(item)}
                    qtd={carrinho.getQtdItem(produto.id)}
                  />
                );
              }
            })}
          </section>
          {qtdProdutos === 0 && (
            <h3 className={styles.nenhumProdutoMsg}>
              Nenhum produto encontrado utilizando esses filtros
              <HiOutlineEmojiSad size={25} />
            </h3>
          )}
        </section>
      </div>
      <Footer />
    </>
  );
}

export async function getServerSideProps() {
  try {
    const response = await api.get("/feira/aberta");

    if (response.status === 200) {
      return {
        props: {},
      };
    } else {
      return {
        redirect: {
          destination: "/feira-fechada",
          permanent: false,
        },
      };
    }
  } catch (error) {
    return {
      redirect: {
        destination: "/feira-fechada",
        permanent: false,
      },
    };
  }
}
