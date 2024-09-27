// app/components/StatsCard.js
import { Box, Text } from '@chakra-ui/react';

export default function StatsCard({ card }) {
  return (
    <Box
      p={4}
      boxShadow="md"
      borderRadius="md"
      bg="white"
      draggable
      id={card.id}
      onDragStart={(e) => {
        e.dataTransfer.setData('text/plain', JSON.stringify(card));
      }}
    >
      <Text fontWeight="bold">{card.title}</Text>
      <Text>{card.content}</Text>
    </Box>
  );
}
