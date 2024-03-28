/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useRef, useState} from 'react';
import {View, Image, Text, TouchableOpacity} from 'react-native';
import TrackPlayer from 'react-native-track-player';

const AudioPlayer: React.FC<{audioPath: any}> = ({audioPath}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState({duration: 0, position: 0});
  const sliderRef = useRef<any>();

  //TrackPlayer engine starter
  useEffect(() => {
    const setupTrackPlayer = async () => {
      await TrackPlayer.setupPlayer();
      await TrackPlayer.add({
        id: 'trackId',
        url: audioPath,
        title: 'Track Title',
        artist: 'Track Artist',
        artwork: 'track.png',
      });
    };

    setupTrackPlayer();
  }, [audioPath]);

  //isPlaying starting interval
  useEffect(() => {
    let x: NodeJS.Timeout;

    if (isPlaying) {
      x = setInterval(() => {
        setProg();
      }, 10);
    }

    return () => {
      clearInterval(x);
    };
  }, [isPlaying]);

  //if interval counting position or restarting audio
  const setProg = async () => {
    const prog = await TrackPlayer.getProgress();
    const {state} = await TrackPlayer.getPlaybackState();

    if (state === 'ended') {
      await TrackPlayer.reset();
      await TrackPlayer.add({
        id: 'trackId',
        url: audioPath,
        title: 'Track Title',
        artist: 'Track Artist',
        artwork: 'track.png',
      });

      TrackPlayer.seekTo(0);
      setIsPlaying(false);
      setProgress({duration: prog.duration, position: 0});
    } else {
      setProgress({duration: prog.duration, position: prog.position});
    }
  };

  const play = async () => {
    await TrackPlayer.play();
    setIsPlaying(true);
  };

  const pause = async () => {
    await TrackPlayer.pause();
    setIsPlaying(false);
  };

  const toggleAudio = () => {
    isPlaying ? pause() : play();
  };

  const icon = isPlaying
    ? require('../assets/pause.png')
    : require('../assets/play.png');

  const convertSecond = (secondsProp: number) => {
    const seconds = Math.floor(secondsProp);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const absoluteWidth = (progress.position / progress.duration) * 100;

  const handlePress = (event: any) => {
    const xCoordinate = event.nativeEvent.locationX;

    if (sliderRef.current) {
      sliderRef.current.measure(
        (x: any, y: any, width: any, height: any, pageX: any, pageY: any) => {
          TrackPlayer.seekTo((xCoordinate / width) * progress.duration);
          setProgress(prev => ({
            ...prev,
            position: (xCoordinate / width) * progress.duration,
          }));
        },
      );
    }
  };

  return (
    <View
      style={{
        height: '100%',
        width: '100%',
        backgroundColor: '#363638',
        borderRadius: 16,
        overflow: 'hidden',
        flexDirection: 'row',
      }}>
      {/** Play button */}
      <TouchableOpacity
        onPress={toggleAudio}
        style={{
          height: '100%',
          aspectRatio: 0.9,
          padding: '5%',
        }}>
        <Image
          source={icon}
          style={{height: '100%', width: '100%', objectFit: 'contain'}}
        />
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={1}
        ref={sliderRef}
        onPress={handlePress}
        style={{
          flex: 1,
          height: '100%',
          justifyContent: 'center',
          marginRight: '5%',
        }}>
        {/** Slider Base */}
        <View
          style={{
            height: '10%',
            width: '100%',
            backgroundColor: '#717173',
            position: 'relative',
            borderRadius: 100,
            overflow: 'hidden',
          }}>
          {/** Progress line inner */}
          <View
            style={{
              height: '100%',
              width: `${absoluteWidth}%`,
              backgroundColor: '#cacaca',
              position: 'absolute',
              left: 0,
            }}
          />
        </View>
        {/** Texts for show duration and position */}
        <View
          style={{
            display: 'flex',
            width: '100%',
            justifyContent: 'space-between',
            flexDirection: 'row',
            position: 'absolute',
            bottom: '10%',
          }}>
          <Text style={{color: '#a4a4a5', fontSize: 8}}>
            {convertSecond(progress.position)}
          </Text>
          <Text style={{color: '#a4a4a5', fontSize: 8}}>
            {convertSecond(progress.duration)}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default AudioPlayer;
