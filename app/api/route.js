"use server"
const { NextResponse } = await import('next/server')
const { utill } = await import('./getmovie/utill/utill')


export const GET = async (req) => {
    try{
        const Url = new URL(req.url)
        const Tmdb_Id = Url.searchParams.get('Tmdb_Id')
        const Type = Url.searchParams.get('Type')
        const Season = Url.searchParams.get('Season')
        const Episode = Url.searchParams.get('Episode')
        const Server = Url.searchParams.get('Server')
        if(!Tmdb_Id || !Type || !Server){
            return NextResponse.json({error: 'Missing required query parameters.'}, {status:400})
        }

        if(Type === 'tv' && (!Season || !Episode)){
            return NextResponse.json({error: 'Missing Season/Episode parameters for TV type.'}, {status:400})
        }
        
        const result = await utill(Tmdb_Id, Type, Season, Episode, Server)
        return NextResponse.json(result)
    }
    catch(error){
        console.error(error)
        return NextResponse.json({error: 'An error occurred while fetching data.'}, {status:500})
    }
}