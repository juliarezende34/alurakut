//Imports
import MainGrid from "../src/components/MainGrid";
import Box from "../src/components/Box";
import { AlurakutMenu, AlurakutProfileSidebarMenuDefault, AlurakutStyles, OrkutNostalgicIconSet } from '../src/lib/AlurakutCommons';
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations'; 
import { useEffect, useState } from "react";
import React from "react";

//Função que monta a barra do perfil
function ProfileSidebar(propriedades) {
  return (
    <Box as="aside">
      <a href = {`https://github.com/${propriedades.githubUser}`}>
        <img src={`https://github.com/${propriedades.githubUser}.png`} style={{ borderRadius: '8px' }} />
      </a>

      <hr/>

      <a href = {`https://github.com/${propriedades.githubUser}`}>
        @{propriedades.githubUser}
      </a>
        
      <hr/>

      <AlurakutProfileSidebarMenuDefault />
      <hr/>
      <p>Outras Redes</p>
      <hr/>
      <ProfileRelationsBoxWrapper>
        <ul>
          <a href="https://www.instagram.com/juliarezende8/?hl=pt-br">
              <img src={`https://logodownload.org/wp-content/uploads/2017/04/instagram-logo-3.png`} width="30px" height="30px" />
            
          </a>
          <a href="https://www.facebook.com/julia.rezende.98434">
              <img src={`https://i0.wp.com/multarte.com.br/wp-content/uploads/2020/09/facebook-logomarca3.png?resize=512%2C512&ssl=1`} width="30px" height="30px" />
            
          </a>
          <a href="https://www.linkedin.com/in/julia-rezende-1732a3188/">
              <img src={`https://image.flaticon.com/icons/png/512/174/174857.png`} width="30px" height="30px" />
            
          </a>
        </ul>
      </ProfileRelationsBoxWrapper>
    </Box>
  ) 
}

export default function Home() {
  //Constantes
    const [comunidades, setComunidades] = React.useState([]);
    const githubUser = 'juliarezende34';
    const pessoasFavoritas = ['elmaia', 'jemaf', 'erikneves04'];
    const [userData, setUserData] = useState({});
    const [followers, setFollowers] = useState([]);
  
  //Carregar os seguidores
    useEffect(() => {
      async function handleLoadFollowers() {
        await fetch(`https://api.github.com/users/${githubUser}/followers`)
        .then(user => user.json())
        .then(user => setFollowers(user))
        .catch(err => console.log(err));
      }

      async function handleUserData() {
        await fetch(`https://api.github.com/users/${githubUser}`)
        .then(user => user.json())
        .then(data => setUserData(data))
        .catch(err => console.log(err));
      }

      handleLoadFollowers();
      handleUserData();
    }, [])

    React.useEffect(function(){
      //API GraphQL
      fetch(`https://graphql.datocms.com/`, {
        method: 'POST',
        headers: {
          'Authorization': 'e97116401c46af7e98838f14447f2a',
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({"query": `query{
          allCommunities {
            id
            title
            link
            image
          }
        }`})
      })
      .then((response) => response.json())
      .then((respostaCompleta) => {
        const comunidadesVindasDoDato = respostaCompleta.data.allCommunities;
        setComunidades(comunidadesVindasDoDato)
      })
    },[])

  return (
    <>
    <AlurakutMenu githubUser={githubUser} />
    <MainGrid>
      <div className="profileArea" style={{gridArea: "profileArea"}}>
        <ProfileSidebar githubUser={githubUser} />
      </div>

      <div className="welcomeArea" style={{gridArea: "welcomeArea"}}>
        <Box>
          <h1 className="title">
            Bem Vindo(a)
            <OrkutNostalgicIconSet />
          </h1>
        </Box>

        <Box>
          <h2 className='subTitle'>O que você deseja fazer?</h2>
          
          <form onSubmit={function handleCriaComunidade(e){
              e.preventDefault();
              const dadosDoForm = new FormData(e.target);
              const comunidade = {
                image: dadosDoForm.get('image'),
                title: dadosDoForm.get('title'),
                link: dadosDoForm.get('link'),
                creatorSlug: githubUser
              }

              fetch('/api/comunidades', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(comunidade)
              })

              .then(async (response)=>{
                const dados = await response.json();
                const comunidade = dados.registroCriado;
                const comunidadesAtualizadas = [...comunidades, comunidade];
                setComunidades(comunidadesAtualizadas)
              })

              
          }}>
            <div>
              <input placeholder="Qual vai ser o nome da sua comunidade?" name="title" aria-label="Qual vai ser o nome da sua comunidade?" type="text"/>
            </div>   

            <div>
              <input placeholder="Insira a URL da foto de capa" name="image" aria-label="Insira a URL da foto de capa"/>
            </div> 

            <div>
              <input placeholder="Insira o link que representa a comunidade" name="link" aria-label="Insira o link que representa a comunidade"/>
            </div> 

            <button>
              Criar comunidade
            </button>

          </form>
        </Box>
      </div>

      <div className="profileRelationsArea" style={{gridArea: "profileRelationsArea"}}>
        <ProfileRelationsBoxWrapper>
          <h2 className="smallTitle">
            Pessoas da Comunidade ({pessoasFavoritas.length})
          </h2>

          <ul>
            {pessoasFavoritas.map(pessoa => {
              return (
                <li key={pessoa}>
                  <a href={`https://github.com/${pessoa}`}>
                  <img src={`https://github.com/${pessoa}.png`} />
                  <span>{pessoa}</span>
                </a>
                </li>
              )
            })}
          </ul>
        </ProfileRelationsBoxWrapper>

        <ProfileRelationsBoxWrapper>
          <h2 className="smallTitle">
            Seguidores 
          </h2>

          <ul>
            {followers.map(pessoa => {
              return (
                <li key={pessoa.id}>
                  <a href={`https://github.com/${pessoa.login}`}>
                  <img src={`https://github.com/${pessoa.login}.png`} />
                  <span>{pessoa.login}</span>
                </a>
                </li>
              )
            })}
          </ul>
        </ProfileRelationsBoxWrapper>

        <ProfileRelationsBoxWrapper>
        <h2 className="smallTitle">
            Minhas comunidades ({comunidades.length})
        </h2>

        <ul>
            {comunidades.map((itemAtual) => {
              return (
                <li key={itemAtual.id}>
                  <a href={`${itemAtual.link}`}>
                    <img src={`${itemAtual.image}`}/>
                    <span>{itemAtual.title}</span>
                  </a>
                </li>
              )
            })}
          </ul>
        </ProfileRelationsBoxWrapper>
      
      </div>

    </MainGrid>
    </>
  )
}