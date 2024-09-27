// app/components/FullScreenPlayer.js
'use client';

import { Box, Text, Image, Button } from '@chakra-ui/react';
import { useState, useEffect } from 'react';

export default function FullScreenPlayer({ cards, cardContents, onExit }) {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [youtubePlayer, setYoutubePlayer] = useState(null);

  useEffect(() => {
    if (currentCardIndex >= cards.length) {
      onExit(); // 모든 카드 실행이 끝나면 전체 화면 종료
    } else {
      const card = cards[currentCardIndex];
      handleCardAction(card);
    }
  }, [currentCardIndex]);

  useEffect(() => {
    // 유튜브 Iframe API가 로드되었는지 확인하고 이벤트 리스너 추가
    window.onYouTubeIframeAPIReady = () => {
      console.log('YouTube Iframe API loaded');
    };
  }, []);

  // 카드의 내용에 따라 동작을 처리하는 함수
  const handleCardAction = (card) => {
    const content = cardContents[card.id] || '';
    speechSynthesis.cancel(); // 이전 발화 중지

    switch (card.id) {
      case 1: // 텍스트 읽기
        const utterance = new SpeechSynthesisUtterance(content);
        utterance.onend = () => nextCard(); // 발화가 끝나면 다음 카드로 이동
        speechSynthesis.speak(utterance);
        break;

      case 2: // 동영상 재생
        if (isYouTubeLink(content)) {
          // 유튜브 링크일 경우 iframe API 사용
          loadYouTubePlayer(content);
        } else {
          // 일반 동영상 URL을 `<video>`로 처리
          const video = document.getElementById('video-player');
          video.src = content;

          // 비디오 로드 및 에러 처리
          video.load();
          video.onloadeddata = () => {
            video.play()
              .then(() => console.log("Video is playing"))
              .catch((err) => console.log("Video play error:", err));
          };

          video.onerror = () => {
            console.error("Failed to load video. Please check the source or format.");
            nextCard(); // 비디오 로드 실패 시 다음 카드로 이동
          };
          video.onended = () => nextCard(); // 동영상 재생이 끝나면 다음 카드로 이동
        }
        break;

      case 3: // 이미지 보기
        setTimeout(() => nextCard(), 5000); // 5초 후 다음 카드로
        break;

      case 4: // 여백 카드 - 10초 유지
        setTimeout(() => nextCard(), 10000);
        break;

      default:
        nextCard(); // 기본적으로 다음 카드로 이동
    }
  };

  // 유튜브 플레이어 로드 함수
  const loadYouTubePlayer = (url) => {
    const videoId = extractYouTubeVideoID(url);
    if (!videoId) return nextCard();

    // 기존 플레이어가 있으면 파괴
    if (youtubePlayer) {
      youtubePlayer.destroy();
      setYoutubePlayer(null);
    }

    const newPlayer = new YT.Player('youtube-player', {
      height: '100%', // 화면 전체 크기로 설정
      width: '100%',
      videoId: videoId,
      playerVars: {
        autoplay: 1,
        controls: 1,
        playsinline: 0, // 전체 화면에서 재생되도록 설정
      },
      events: {
        onReady: () => {
          // YouTube 플레이어가 준비되면 전체 화면으로 설정
          const playerElement = document.getElementById('youtube-player');
          if (playerElement.requestFullscreen) {
            playerElement.requestFullscreen();
          } else if (playerElement.mozRequestFullScreen) { /* Firefox */
            playerElement.mozRequestFullScreen();
          } else if (playerElement.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
            playerElement.webkitRequestFullscreen();
          } else if (playerElement.msRequestFullscreen) { /* IE/Edge */
            playerElement.msRequestFullscreen();
          }
        },
        onStateChange: onPlayerStateChange,
      },
    });

    setYoutubePlayer(newPlayer);
  };

  // 유튜브 플레이어 상태 변경 이벤트 핸들러
  const onPlayerStateChange = (event) => {
    if (event.data === YT.PlayerState.ENDED) {
      // 동영상 재생이 끝나면 다음 카드로 이동
      nextCard();
    }
  };

  // 유튜브 링크 확인 함수
  const isYouTubeLink = (url) => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
    return youtubeRegex.test(url);
  };

  // 유튜브 비디오 ID 추출 함수
  const extractYouTubeVideoID = (url) => {
    const match = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : null;
  };

  // 다음 카드로 이동
  const nextCard = () => {
    setCurrentCardIndex((prev) => prev + 1);
  };

  const currentCard = cards[currentCardIndex];
  const content = cardContents[currentCard?.id] || '';

  return (
    <Box
      position="fixed"
      top="0"
      left="0"
      width="100vw"
      height="100vh"
      bg="black"
      color="white"
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      zIndex="9999"
    >
      {/* 텍스트 카드 */}
      {currentCard?.id === 1 && <Text fontSize="2xl">{content}</Text>}

      {/* 동영상 카드 */}
      {currentCard?.id === 2 && (
        <Box id="video-container" width="100vw" height="100vh">
          {/* 유튜브 플레이어를 위한 DIV */}
          <div id="youtube-player" style={{ width: '100%', height: '100%' }}></div>

          {/* 일반 비디오 플레이어 */}
          <video id="video-player" width="100%" height="100%" controls>
            <track kind="captions" />
          </video>
        </Box>
      )}

      {/* 이미지 카드 */}
      {currentCard?.id === 3 && <Image src={content} maxH="80%" />}

      {/* 여백 카드 */}
      {currentCard?.id === 4 && <Text fontSize="2xl">Empty Space</Text>}

      {/* 전체 화면 종료 버튼 */}
      <Button mt={4} onClick={onExit}>
        Exit Full Screen
      </Button>
    </Box>
  );
}
