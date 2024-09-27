// app/components/CardDialog.js
'use client';

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Input,
  Button,
  useDisclosure,
} from '@chakra-ui/react';
import { useState } from 'react';

export default function CardDialog({ isOpen, onClose, card, onSave, initialContent }) {
  const [content, setContent] = useState(initialContent);

  const handleSave = () => {
    onSave(content);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{card.title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {card.id === 1 && (
            <Input
              placeholder="Enter text to read"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          )}
          {card.id === 2 && (
            <Input
              placeholder="Enter video link"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          )}
          {card.id === 3 && (
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                const reader = new FileReader();
                reader.onload = () => setContent(reader.result);
                reader.readAsDataURL(file);
              }}
            />
          )}
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSave}>
            Save
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
