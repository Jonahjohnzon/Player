export const utill = async (Tmdb_Id, Type, Season, Episode, Server) => {
    try{
        const media ={Tmdb_Id, Type, Season, Episode, Server}
        switch(Server){
            case 'Vidrock':
                const { vidRockProvider } = await import('../providers/vidrock/vidrock')
                return await vidRockProvider(media)
            case 'Vixsrc':
                const { vixSrcProvider } = await import('../providers/vixsrc/vixsrc')
                return await vixSrcProvider(media)
            default:
                return {error: 'Unsupported server.'}
        }

    }
    catch(error){
        console.error(error)
        return {error: 'An error occurred while fetching data.'}
    }
}