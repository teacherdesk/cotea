// app/dashboard/stats/page.js
'use client';

import { Box, Flex, SimpleGrid, Button, useDisclosure, Input, Text, IconButton } from '@chakra-ui/react';
import { useState, useRef, useEffect } from 'react';
import StatsCard from '../../components/StatsCard';
import CardDialog from '../../components/CardDialog';
import FullScreenPlayer from '../../components/FullScreenPlayer';
import { DeleteIcon } from '@chakra-ui/icons';

const initialCards = [
  { id: 1, title: 'Card 1', content: 'Click to input text' },
  { id: 2, title: 'Card 2', content: 'Click to input video link' },
  { id: 3, title: 'Card 3', content: 'Click to select an image' },
  { id: 4, title: 'Card 4', content: 'Empty space for 10 seconds' }, // 여백 카드
];

export default function StatsPage() {
  const [leftCards] = useState(initialCards); // 기본 카드 리스트
  const [rightCards, setRightCards] = useState([]); // 드래그된 카드 리스트
  const [selectedCard, setSelectedCard] = useState(null);
  const [cardContents, setCardContents] = useState({});
  const [collectionName, setCollectionName] = useState('Untitled 1'); // 카드 모음의 이름
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isPlaying, setIsPlaying] = useState(false); // 전체화면 플레이 상태
  const videoRefs = useRef({}); // 각 비디오 참조를 저장할 객체
  const [savedCollections, setSavedCollections] = useState([]); // 저장된 파일 목록

  useEffect(() => {
    // 컴포넌트가 마운트될 때 로컬 저장소에서 파일 목록을 불러옴
    loadSavedCollections();
  }, []);

  // 로컬 저장소에서 저장된 파일 목록을 불러오는 함수
  const loadSavedCollections = () => {
    const collections = JSON.parse(localStorage.getItem('cardCollections')) || [];
    setSavedCollections(collections);
  };

  // 카드 드롭 핸들러
  const handleDrop = (e) => {
    const card = JSON.parse(e.dataTransfer.getData('text/plain'));
    if (!rightCards.find((c) => c.uniqueId === card.uniqueId)) {
      setRightCards((prevCards) => [...prevCards, { ...card, uniqueId: Date.now() }]);
    }
  };

  // 드래그 허용 핸들러
  const allowDrop = (e) => {
    e.preventDefault();
  };

  // 카드 클릭 시 다이얼로그 오픈 핸들러
  const handleCardClick = (card) => {
    setSelectedCard(card);
    onOpen();
  };

  // 다이얼로그에서 입력된 내용 저장
  const handleSaveContent = (content) => {
    setCardContents((prev) => ({
      ...prev,
      [selectedCard.id]: content,
    }));
    onClose();
  };

  // 전체 화면 플레이 시작
  const handlePlay = () => {
    // 비디오 로드 및 일시정지 설정
    rightCards.forEach((card) => {
      if (card.id === 2) { // 비디오 카드일 때만
        const video = videoRefs.current[card.uniqueId];
        if (video) {
          video.src = cardContents[card.id]; // 비디오 소스를 설정
          video.load(); // 비디오 로드
          video.pause(); // 일시정지 상태로 설정
        }
      }
    });
    setIsPlaying(true); // 전체화면 플레이 상태 설정
  };

  // 전체 화면 플레이 종료
  const handleExitFullScreen = () => {
    setIsPlaying(false);
  };

  // 카드 모음을 로컬 저장소에 저장하는 함수
  const handleSaveCollection = () => {
    if (!collectionName.trim()) {
      alert('Please enter a collection name!');
      return;
    }
  
    let collections = JSON.parse(localStorage.getItem('cardCollections')) || [];
    let newCollectionName = collectionName;
    let counter = 1;
  
    // 이름 중복 확인 및 새로운 이름 설정
    while (collections.some(collection => collection.name === newCollectionName)) {
      newCollectionName = `${collectionName} (${counter})`;
      counter++;
    }
  
    const newCollection = {
      name: newCollectionName,
      cards: rightCards,
      contents: cardContents,
    };
  
    collections.push(newCollection);
    localStorage.setItem('cardCollections', JSON.stringify(collections));
  
    // 새로운 컬렉션 이름 설정
    setCollectionName(newCollectionName); // 수정된 부분
  
    loadSavedCollections(); // 저장된 목록 다시 불러오기
  };
  

  // 저장된 파일을 불러오는 함수
  const handleLoadCollection = (collection) => {
    setRightCards(collection.cards);
    setCardContents(collection.contents);
    setCollectionName(collection.name); // 불러온 파일 이름으로 변경
  };

  // 저장된 파일을 삭제하는 함수
  const handleDeleteCollection = (index) => {
    const collections = JSON.parse(localStorage.getItem('cardCollections')) || [];
    collections.splice(index, 1); // 해당 인덱스의 항목을 삭제
    localStorage.setItem('cardCollections', JSON.stringify(collections));
    loadSavedCollections(); // 저장된 목록 다시 불러오기
  };

  return (
    <Flex height="100vh" p={4} gap={4}>
      {/* 왼쪽 영역 - 카드들이 2열로 배치됨 */}
      <Box flex="1" p={2} border="1px solid gray" overflowY="auto">
        <SimpleGrid columns={2} spacing={4}>
          {leftCards.map((card) => (
            <StatsCard key={card.id} card={card} />
          ))}
        </SimpleGrid>
      </Box>

      {/* 중간 영역 - 드래그로 옮길 공간 및 카드 모음 관리 */}
      <Box
        flex="3"
        p={2}
        border="1px solid gray"
        position="relative" // Play 버튼을 이 안에서 위치시킬 수 있게 만듦
        onDrop={handleDrop}
        onDragOver={allowDrop}
      >
        <Flex alignItems="center" justifyContent="space-between" mb={4}>
          {/* 카드 모음 이름 입력 필드 */}
          <Input
            value={collectionName}
            onChange={(e) => setCollectionName(e.target.value)}
            width="60%"
            placeholder="Enter collection name"
          />

          {/* Save 및 Play 버튼 */}
          <Box>
            <Button colorScheme="blue" mr={2} onClick={handleSaveCollection}>
              Save
            </Button>
            <Button colorScheme="green" onClick={handlePlay}>
              Play
            </Button>
          </Box>
        </Flex>

        {rightCards.map((card) => (
          <Box
            key={card.uniqueId}
            position="relative"
            mb={4}
            p={4}
            border="1px solid black"
            borderRadius="md"
            onClick={() => handleCardClick(card)} // 카드 클릭 시 다이얼로그 오픈
          >
            <StatsCard card={card} />
            {/* 비디오 참조를 객체에 저장 */}
            {card.id === 2 && (
              <video
                ref={(el) => (videoRefs.current[card.uniqueId] = el)}
                style={{ display: 'none' }} // 비디오가 화면에 표시되지 않도록 숨김
              />
            )}
          </Box>
        ))}
      </Box>

      {/* 오른쪽 영역 - 저장된 파일 목록 */}
      <Box flex="1" p={2} border="1px solid gray" overflowY="auto">
        <Text fontSize="lg" mb={4}>
          Saved Collections
        </Text>
        {savedCollections.length > 0 ? (
          savedCollections.map((collection, index) => (
            <Flex
              key={index}
              p={2}
              mb={2}
              border="1px solid blue"
              borderRadius="md"
              alignItems="center"
              justifyContent="space-between"
              cursor="pointer"
              _hover={{ bg: 'gray.100' }}
            >
              {/* 파일 이름을 클릭하면 불러오기 */}
              <Box onClick={() => handleLoadCollection(collection)} flex="1">
                {collection.name}
              </Box>
              {/* 삭제 버튼 */}
              <IconButton
                icon={<DeleteIcon />}
                size="sm"
                colorScheme="red"
                onClick={() => handleDeleteCollection(index)}
                aria-label="Delete collection"
              />
            </Flex>
          ))
        ) : (
          <Text>No collections saved yet.</Text>
        )}
      </Box>

      {/* 카드 다이얼로그 */}
      {selectedCard && (
        <CardDialog
          isOpen={isOpen}
          onClose={onClose}
          card={selectedCard}
          onSave={handleSaveContent}
          initialContent={cardContents[selectedCard.id] || ''}
        />
      )}

      {/* 전체 화면 플레이어 */}
      {isPlaying && (
        <FullScreenPlayer
          cards={rightCards}
          cardContents={cardContents}
          videoRefs={videoRefs}
          onExit={handleExitFullScreen}
        />
      )}
    </Flex>
  );
}
