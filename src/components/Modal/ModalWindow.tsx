import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
} from "@chakra-ui/react";

interface IModalParams {
  isOpen: boolean;
  onClose: () => void;
  deleteNote: () => void;
}

export default function ModalWindow({
  isOpen,
  onClose,
  deleteNote,
}: IModalParams) {
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Warning</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <p>If you delete this note, you cannot restore it.</p>
            <p>Are you sure you want to delete it?</p>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="pink" mr={3} onClick={deleteNote}>
              Yes, delete
            </Button>
            <Button colorScheme="green" mr={3} onClick={onClose}>
              No
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
