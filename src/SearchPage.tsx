import { useState,useEffect,useContext,useRef} from "react";
import { useQuery } from "@tanstack/react-query";
import './SearchPage.css';
import { currentSongContext } from "./App";
import closewhite from "./assets/close-white.png";
import { useDebounce } from "use-debounce";
import SongSearchCard from "./SongSearchCard";
import SearchPageAudioControl from "./SearchPageAudioControl";

export default function SearchPage() {
    const [searchText, setSearchText] = useState("");
    const searchInputRef = useRef(null);
    const {currentSongUrl, setCurrentSongUrl, progress, mode, setMode} = useContext(currentSongContext);
    
    const handleSearchChange=(e)=>{
        if(e.target.value){
        setSearchText(e.target.value);
        }
    }
    const [value] = useDebounce(searchText, 200); 

    const fetchSongs = async (query) => {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/search?q=${query}`);
        const data = await response.json();
        return data;
    }
    
    const {data: searchResult, isLoading, isError } = useQuery({
        queryKey: ['searchSongs', value], // Query triggers only when 'value' changes
        queryFn: () => fetchSongs(value),
        enabled: value?value.length > 1:false,
    });


    return (
        <div className="search-page">

            <div className="search-page-header">
                <div className="search-page-name">Search</div>
                <div className="search-page-close-container">
                    <img src={closewhite} alt="white close button" className="search-page-close"/>
                </div>
            </div>

            <div className="search-bar">
                <input type="text" ref={searchInputRef} placeholder="search title or artist" className="search-bar-input" onChange={e=>handleSearchChange(e)}/>
            </div>

            <div className="search-results">
                {searchResult?.map((song) => (
                    <SongSearchCard key={song.song_id} title={song.title} artist={song.artist} album_id={song.album_id} id={song.song_id} />
                       
                ))}
            </div>
            
            <SearchPageAudioControl className="control-css-wrapper" />
        </div>
    );
}