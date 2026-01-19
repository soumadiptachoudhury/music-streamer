import {useState, useEffect, useRef} from "react";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";

export default function App() {

  
  const [currentSongUrl, setCurrentSongUrl] = useState("S1.mp3")
  const songRef = useRef(null)
  const progressBarRef = useRef(null);
  const [searchText, setSearchText] = useState(null)
  const [value] = useDebounce(searchText, 200); 
  const playpauseRef = useRef(null)
  const [currentPlaylistId, setCurrentPlaylistId] = useState(null)

  const [isPlaying, setIsPlaying] = useState(false)

  function handlePlayPause(){
    if(isPlaying){
      songRef.current?.pause();
      setIsPlaying(false);
    }else{
      songRef.current?.play();
      setIsPlaying(true);
    }
  }

  async function fetchSongs(value) {
    const response = await fetch(
      `http://localhost:5000/api/search?q=${value}`
    );

    const data = await response.json(); // 👈 await ONCE

    if (!response.ok) {
      throw new Error(data.error || "Network response was not ok");
    }
    console.log(data)
    return data;
  }

  const {data: searchResult, isLoading, isError } = useQuery({
    queryKey: ['searchSongs', value], // Query triggers only when 'value' changes
    queryFn: () => fetchSongs(value),
    enabled: value?value.length > 2:false,
  });

  const handleTimeUpdate = () => {
    const progress = (songRef.current.currentTime / songRef.current.duration) * 100;
    if (progressBarRef.current) {
      progressBarRef.current.style.width = `${progress}%`;
    }
  };

  const handleSeek = (e) => {
    const container = e.currentTarget; // The outer bar
    const clickX = e.nativeEvent.offsetX;
    const width = container.clientWidth;
    const seekTime = (clickX / width) * songRef.current.duration;
    songRef.current.currentTime = seekTime;
  };
  

  const handleSearchChange=(e)=>{
    if(e.target.value){
      setSearchText(e.target.value);
    }
  }

  const playSong = (filename) => {
    setCurrentSongUrl(filename);
    songRef.current.currentTime = 0;
    progressBarRef.current.style.width = `0%`
  };

  useEffect(()=>{
    if(currentSongUrl && songRef.current){
      songRef.current.play().catch(err => console.log(err));
      playpauseRef.current.textContent = 'Pause';
    }
  }, [currentSongUrl])

  return(
    <div>
      <h5>music streamer</h5>
      <div className="player">
        <audio 
          ref={songRef} 
          src={`http://localhost:5000/song/${currentSongUrl}.mp3`} 
          onTimeUpdate={handleTimeUpdate} 
        />

        <button onClick={handlePlayPause} ref={playpauseRef}>{isPlaying ? 'Pause' : 'Play'}</button>
        <button onClick={() => songRef.current.currentTime = 0}>Rewind</button>

        {/* The Seekable Container */}
        <div 
          className="progress-container" 
          onClick={handleSeek}
          style={{ width: '100%', height: '10px', background: '#333', cursor: 'pointer' }}
        >
          {/* The Visual Bar updated via Ref */}
          <div 
            ref={progressBarRef} 
            className="progress-fill" 
            style={{ width: '0%', height: '100%', background: 'limegreen' }} 
          />
        </div>
      </div>
      <div className="search-section">
        <div className="search-bar">
          <input type="text" onChange={e=> handleSearchChange(e)} />
        </div>
        <div className="search-results">
          {searchText?.length > 1
          ? searchResult?.map((ele) => (
              <div 
                key={ele.id} 
                onClick={() => playSong(ele.filename)} 
                style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', cursor: 'pointer' }}
              >
                {/* Album Cover */}
                <img 
                  src={`http://localhost:5000/pictures/AL${ele.album_id}.jpg`} 
                  alt={`${ele.title} album cover`} 
                  style={{ width: '50px', height: '50px', objectFit: 'cover', marginRight: '10px', borderRadius: '4px' }}
                />

                {/* Song Info */}
                <div>
                  <h3 style={{ margin: 0 }}>{ele.title}</h3>
                  <p style={{ margin: 0 }}>{ele.artist}</p>
                </div>
              </div>
            ))
          : null}
        </div>
      </div>
    </div>
  )
}