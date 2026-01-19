import { useContext, useRef,useEffect,useState } from "react";
import { currentSongContext } from "./App";
import "./ExpandedSongPage.css";
import likewhite from "./assets/like-white.png";
import menuvertical from "./assets/menu-vertical-black.png";
import pause from './assets/pause.png';
import play from './assets/play.png';
import prev from './assets/prev.png';
import next from './assets/next.png';

export default function ExpandedSongPage() {
    const {currentSongUrl, setCurrentSongUrl, progress, mode, setMode, currentTitle, currentArtist,songRef, isPlaying, setIsPlaying, currentAlbumId,currentIndex, displayQueue,repeatMode,setCurrentIndex} = useContext(currentSongContext);

    const progressBarRef = useRef(null);

          function handlePlayPause(){
    if(isPlaying){
      songRef.current?.pause();
      setIsPlaying(false);
    }else{
      songRef.current?.play();
      setIsPlaying(true);
    }
  }

  function playNext() {
    if (!displayQueue.length) return;

    if (repeatMode === 'one') {
        if (songRef.current) {
            songRef.current.currentTime = 0;
            songRef.current.play();
        }
        return;
    }

    // Normal progression through displayQueue
    if (currentIndex < displayQueue.length - 1) {
        setCurrentIndex(prev => prev + 1);
    } else if (repeatMode === 'all') {
        setCurrentIndex(0); // Loop back to start
    } else {
        setIsPlaying(false); // End of queue reached
    }
}
  function playPrev() {
    if (songRef.current && songRef.current.currentTime > 3) {
      // If song played for > 3s, restart it instead of going back
      songRef.current.currentTime = 0;
    } else if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  }


      const handleSeek = (e) => {
    const container = e.currentTarget; // The outer bar
    const clickX = e.nativeEvent.offsetX;
    const width = container.clientWidth;
    const seekTime = (clickX / width) * songRef.current.duration;
    songRef.current.currentTime = seekTime;
  };

    const formatTime = (time) => {
  if (isNaN(time)) return "0:00";
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

    const titleRef = useRef(null);
      const artistRef = useRef(null);
    
      const [isTitleTooLong, setIsTitleTooLong] = useState(false);
      const [isArtistTooLong, setIsArtistTooLong] = useState(false);
    
      useEffect(() => {
        // Check if the actual text is wider than the 160px limit
        if (titleRef.current) {
          setIsTitleTooLong(titleRef.current.scrollWidth > 230);
        }
        if (artistRef.current) {
          setIsArtistTooLong(artistRef.current.scrollWidth > 230);
        }
      }, [currentArtist, currentTitle]);
      

    return (
        <div className="expanded-song-page">
            <div className="back-button" onClick={() => setMode("search")}>back</div>
            <div className= 'expanded-song-page-main-body'>
                <img src={`/pictures/AL${currentAlbumId}.jpg`} alt="" style={{width:"320px", height:"320px",borderRadius:"20px"}} />

                <div className="expanded-info">
                    <div className={isTitleTooLong?"expanded-info-left-marquee-container":"expanded-info-left"} style={{whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", width: "230px"}}>
                        <div 
                            ref={titleRef} 
                            style={{
                                fontSize:"24px", 
                                fontWeight:"700",
                                color:"white",
                                display:"inline-block", 
                                animation: isTitleTooLong ? "marquee 30s linear infinite" : "none",
                                paddingLeft:"10px"
                            }}
                            >
                            {currentTitle}
                           
                            {isTitleTooLong && <span style={{paddingLeft: '50px'}}>{currentTitle}</span>}
                        </div>
                        <div ref = {artistRef} style={{fontSize:"15px", marginLeft:"10px", color:"white",animation: isArtistTooLong ? "marquee 10s linear infinite" : "none"}}>{currentArtist}</div>
                    </div>

                    <div className='expanded-info-right'>
                        <img src={likewhite} alt="" style={{width:"30px", height:"30px"}} />
                        <img src={menuvertical} alt="" style={{width:"30px", height:"30px"}} />
                    </div>
                </div>

                <div className="progress-area">
                    <div className="progress-bar" style={{height:'10px', width:'310px', marginTop:'20px'}}>
                        <div 
                            className="progress-container" 
                            onClick={handleSeek}
                            style={{ width: '100%', height: '10px', background: 'black', cursor: 'pointer', borderRadius:'5px' }}
                            >
                            {/* The Visual Bar updated via Ref */}
                            <div 
                                ref={progressBarRef} 
                                className="progress-fill" 
                                style={{ width: `${progress}%`, height: '100%', background: 'white', borderRadius:'5px' }} 
                            />
                            
                            </div>
                    </div>

                    <div className="time-info">
                        <div>{formatTime(songRef.current?.currentTime || 0)}</div>
                        <div>{formatTime(songRef.current?.duration - songRef.current?.currentTime || 0)}</div>
                    </div>
                </div>
                <div className='expanded-page-audio-buttons'>
                    <img src={prev} alt="Previous" style={{width: "40px", height: "40px", marginRight: "10px"}} onClick={playPrev}/>
                    <img src={isPlaying ? pause : play} alt="Play/Pause" style={{width: "40px", height: "40px"}} onClick={handlePlayPause}/>
                    <img src={next} alt="Next" style={{width: "40px", height: "40px"}} onClick={playNext}/>
                </div>
            </div>
        </div>
    );
}
