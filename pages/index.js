import MainGrid from "../src/components/MainGrid";
import Box from "../src/components/Box";
import { AlurakutMenu, AlurakutProfileSidebarMenuDefault, AlurakutStyles, OrkutNostalgicIconSet } from '../src/lib/AlurakutCommons';
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations'; 
import { useEffect, useState } from "react";
import React from "react";

function ProfileSidebar(propriedades) {
  return (
    <Box as="aside">
      <img src={`https://github.com/${propriedades.githubUser}.png`} style={{ borderRadius: '8px' }} />
      <hr/>
      <a className="" href={`https://github.com/${propriedades.githubUser}`}>
        @{propriedades.githubUser}
        
      </a>
      <div></div>
      <AlurakutProfileSidebarMenuDefault />
    </Box>
  )
}

export default function Home() {
  const [comunidades, setComunidades] = React.useState([{
    title:'Odeio acordar cedo', 
    id: '12345',
    image: 'https://www.pngkey.com/png/full/14-148130_minion-imagenes-de-100x100-pixeles.png'}]);
  const githubUser = 'juliarezende34';
  const pessoasFavoritas = ['elmaia', 'jemaf', 'erikneves04'];

  const [userData, setUserData] = useState({});
  const [followers, setFollowers] = useState([]);

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
                id: new Date().toISOString(),
                titulo: dadosDoForm.get('title'),
                image: dadosDoForm.get('image'),
              }
              const comunidadesAtualizadas = [...comunidades, comunidade]
              setComunidades(comunidadesAtualizadas)
          }}>
            <div>
              <input placeholder="Qual vai ser o nome da sua comunidade?" name="title" aria-label="Qual vai ser o nome da sua comunidade?" type = "text"/>
            </div>   

            <div>
              <input placeholder="Coloque uma URL para usarmos de capa" name="image" aria-label="Coloque uma URL para usarmos de capa" />
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
                  <a href={`/users/${pessoa}`}>
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
                  <a href={`/users/${pessoa.login}`}>
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
            {comunidades.map(itemAtual => {
              return (
                <li key={itemAtual.id}>
                  <a href={`/users/${itemAtual.title}`} key={itemAtual.title}>
                  <img src={itemAtual.image} />
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