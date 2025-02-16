import {useState, useEffect, useRef } from 'react'
import Meaning from './Meaning'
import playIcon from '../assets/images/icon-play.svg'
import newWindowIcon from '../assets/images/icon-new-window.svg'

export default function Word({ data }) {
  const audioRef = useRef(null);
  const [audioError, setAudioError] = useState(null); // State for audio error

  useEffect(() => {
    const validPhonetics = `https://api.dictionaryapi.dev/media/pronunciations/en/${data.term}-us.mp3`;

    if (data.term) {
      setAudioError(null); // Clear any previous errors
      audioRef.current = new Audio(); // Create Audio object first

      audioRef.current.onerror = (error) => {
        console.error("Audio Error:", error);
        setAudioError("Error loading audio. Word not found or invalid URL.");
        audioRef.current = null; // Important: Clear the reference on error
      };

      audioRef.current.onload = () => {
        // Audio loaded successfully
      };

      audioRef.current.src = validPhonetics; // Set the source *after* setting error handler
    } else {
      setAudioError(null);
      audioRef.current = null;
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [data.term]);

  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };
  console.log(data)
  const definition =  <Meaning meaning={data.definition} />

  return (
    <main className="mt-10 mb-[5.25rem] tablet:mt-11 tablet:mb-[7.75rem]">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-mobile-heading-l tablet:text-heading-l tablet:leading-heading-l font-bold tablet:mb-2">
            {data.term}
          </h1>
        </div>
        {!audioError && (
          <button aria-label="Play" onClick={playAudio}>
            <img src={playIcon} aria-hidden="true" alt="Play icon" className="w-[48px] tablet:w-[75px]" />
          </button>
        )}
      </div>
      {definition}
    </main>
  )
}
