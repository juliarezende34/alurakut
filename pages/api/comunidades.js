import {SiteClient} from 'datocms-client';

export default async function recebedorDeRequests(request, response){
    if(request.method === 'POST'){
        const TOKEN = '47b19026594174578a62db81f021c2';
        const client = new SiteClient(TOKEN);

        const registroCriado = await client.items.create({
            itemType: "972020",
            ...request.body,
            //title: "Teste",
            //link: "https://www.youtube.com/watch?v=zvj9EqN6h6U",
            //creatorSlug: "juliarezende34"
        })

        response.json({
            dados: 'algum dado qualquer',
            registroCriado: registroCriado,
        })
        return;
    }
    
    response.status(404).json({
        message: 'Ainda não temos nada no GET, mas no POST tem'
    })
        
}