import './SearchPageAudioControl.css';
import { useState,useEffect,useContext,useRef} from "react";
import { currentSongContext } from "./App";
import menuVerticalBlack from './assets/menu-vertical-black.png';
import play from './assets/play.png';
import pause from './assets/pause.png';
import prev from './assets/prev.png';
import next from './assets/next.png';
export default function SearchPageAudioControl() {

    const {currentSongUrl, setCurrentSongUrl, progress, mode, setMode, songRef, isPlaying, setIsPlaying, currentTitle, currentArtist, currentAlbumId} = useContext(currentSongContext);

      function handlePlayPause(){
    if(isPlaying){
      songRef.current?.pause();
      setIsPlaying(false);
    }else{
      songRef.current?.play();
      setIsPlaying(true);
    }
  }

  const titleRef = useRef(null);
  const artistRef = useRef(null);

  const [isTitleTooLong, setIsTitleTooLong] = useState(false);
  const [isArtistTooLong, setIsArtistTooLong] = useState(false);

  useEffect(() => {
    // Check if the actual text is wider than the 160px limit
    if (titleRef.current) {
      setIsTitleTooLong(titleRef.current.scrollWidth > 160);
    }
    if (artistRef.current) {
      setIsArtistTooLong(artistRef.current.scrollWidth > 160);
    }
  }, [currentArtist, currentTitle]);
  
useEffect(() => {
  if (isPlaying && songRef.current) {
    songRef.current.play().catch(err => console.log(err));
  }
}, [currentSongUrl, isPlaying]);
    


    return (
        <div className="search-page-audio-control" >
            <div className='search-page-audio-left'>
                <img 
                    src={`${import.meta.env.VITE_API_BASE_URL}/pictures/AL${currentAlbumId}.jpg`} 
                    className="song-search-card-thumbnail"
                    />
                <div className="song-search-card-text" style={{whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", width: "160px"}}>
                    <h3 ref= {titleRef} style={{fontSize: "16px", fontWeight: "700",  color:'white', display:"inline-block", animation: isTitleTooLong ?  "marquee 10s linear infinite" : "none"}}>{currentTitle}</h3>
                    <p ref = {artistRef} style={{fontSize: "12px", color: "white", fontWeight:"700", animation: isArtistTooLong ? "marquee 10s linear infinite" : "none"}}>{currentArtist}</p>
                </div>
            </div>
            <div className='search-page-audio-buttons'>
                <img src={prev} alt="Previous" style={{width: "40px", height: "40px", marginRight: "10px"}} onClick={()=> songRef.current.currentTime = 0}/>
                <img src={isPlaying ? pause : play} alt="Play/Pause" style={{width: "40px", height: "40px"}} onClick={handlePlayPause}/>
                {/* <img src={next} alt="Next" style={{width: "40px", height: "40px"}} onClick={()=> songRef.current.currentTime += 10}/> */}
            </div>
            <div className='search-page-audio-clicker' onClick={() => setMode("expanded")}></div>
        </div>
    )
}