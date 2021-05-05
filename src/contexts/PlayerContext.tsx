import { createContext, ReactNode, useState } from 'react'

type Episode = {
    title: string,
    members: string,
    thumbnail: string,
    duration: number,
    url: string
}

type PlayerContextProviderProps = {
    children: ReactNode
}

type PlayerContextData = {
    episodeList: Episode[],
    currentEpisodeIndex: number,
    isPlaying: boolean,
    play: (episode: Episode) => void,
    playList: (list: Episode[], index: number) => void,
    setPlayingState: (state: boolean) => void,
    playNext: () => void,
    playPrevious: () => void,
    tooglePlay: () => void,
    hasPrev: boolean,
    hasNext: boolean
}

export const PlayerContext = createContext({} as PlayerContextData)

export function PlayerContextProvider({ children }: PlayerContextProviderProps) {
    const [episodeList, setEpisodeList] = useState([])
    const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0)
    const [isPlaying, setIsPlaying] = useState(false)

    function play(episode: Episode) {
        setEpisodeList([episode])
        setCurrentEpisodeIndex(0)
        setIsPlaying(true)
    }

    function playList(list: Episode[], index: number) {
        setEpisodeList(list)
        setCurrentEpisodeIndex(index)
        setIsPlaying(true)
    }

    const hasNext = (currentEpisodeIndex + 1) < episodeList.length
    const hasPrev = currentEpisodeIndex > 0

    function playNext() {
        if (hasNext)
            setCurrentEpisodeIndex(currentEpisodeIndex + 1)
    }

    function playPrevious() {
        if (hasPrev)
            setCurrentEpisodeIndex(currentEpisodeIndex - 1)
    }

    function tooglePlay() {
        setIsPlaying(!isPlaying)
    }

    function setPlayingState(state: boolean) {
        setIsPlaying(state)
    }

    return (
        <PlayerContext.Provider value={{
            episodeList,
            currentEpisodeIndex,
            play,
            playList,
            hasNext,
            hasPrev,
            playNext,
            playPrevious,
            isPlaying,
            tooglePlay,
            setPlayingState
        }}>
            {children}
        </PlayerContext.Provider>
    )
}